import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewServices } from './review.service';

// add a product review
const addProductReviewAndRatingInDB = catchAsync(async (req, res) => {
  const productId = req.params.productId;
  const reviewData = req.body;
  const userId = req.user.userId;

  const result = await ReviewServices.addASingleProductReviewAndRatingInDB(
    productId,
    reviewData,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review added successfully!',
    data: result,
  });
});

// delete review from db
const deleteASingleProductReviewInDB = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;

  const result = await ReviewServices.deleteASingleProductReviewInDB(reviewId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully!',
    data: result,
  });
});

export const ReviewControllers = {
  addProductReviewAndRatingInDB,
  deleteASingleProductReviewInDB,
};
