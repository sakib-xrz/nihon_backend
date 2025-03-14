/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../Product/product.model';
import { TProduct } from '../Product/product.interface';
import { Review } from './review.model';
import { TReview } from './review.interface';
import { Types } from 'mongoose';

// adding a product review
const addASingleProductReviewAndRatingInDB = async (
  productId: string,
  reviewData: TReview,
  userId: string,
) => {
  // finding the product
  const product: TProduct | null =
    await Product.isProductExistsByIdAndNotDeleted(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // validating the rating
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Rating must be between 1 and 5',
    );
  }

  const isReviewAlreadyExists = product.reviews?.some((review: any) => {
    return review.reviewer.toString() === userId;
  });

  if (isReviewAlreadyExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You already reviewed this product!',
    );
  }

  // ensuring reviews is initialized
  if (!product.reviews) {
    product.reviews = [];
  }

  // crete a new review
  const newReview = await Review.create({
    reviewer: userId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  // adding the new review ID to the product's reviews array
  product.reviews.push(new Types.ObjectId(newReview._id));

  // calculating the new average rating
  const reviews = await Review.find({ _id: { $in: product.reviews } });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // updating the product's average rating
  product.averageRating = averageRating;

  // saving the updated product
  await (product as any).save();

  return Product.findById(product._id)
    .populate('brand')
    .populate('category')
    .populate('reviews');
};

// delete review from db
const deleteASingleProductReviewInDB = async (reviewId: string) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  const product = await Product.findOne({ reviews: reviewId });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // ensuring reviews is defined
  if (!product.reviews) {
    product.reviews = [];
  }

  // removing the review ID from the product's reviews array
  product.reviews = product.reviews.filter(
    (id: Types.ObjectId) => !id.equals(reviewId),
  );

  // recalculating the average rating
  const reviews = await Review.find({ _id: { $in: product.reviews } });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length ? totalRating / reviews.length : 0;
  product.averageRating = averageRating;

  // saving the updated product
  await product.save();

  // deleting the review from the database
  await Review.findByIdAndDelete(reviewId);

  return Product.findById(product._id)
    .populate('brand')
    .populate('category')
    .populate('reviews');
};

export const ReviewServices = {
  addASingleProductReviewAndRatingInDB,
  deleteASingleProductReviewInDB,
};
