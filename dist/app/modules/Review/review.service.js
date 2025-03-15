"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../Product/product.model");
const review_model_1 = require("./review.model");
const mongoose_1 = require("mongoose");
// adding a product review
const addASingleProductReviewAndRatingInDB = (productId, reviewData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // finding the product
    const product = yield product_model_1.Product.isProductExistsByIdAndNotDeleted(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    // validating the rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Rating must be between 1 and 5');
    }
    const isReviewAlreadyExists = (_a = product.reviews) === null || _a === void 0 ? void 0 : _a.some((review) => {
        return review.reviewer.toString() === userId;
    });
    if (isReviewAlreadyExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You already reviewed this product!');
    }
    // ensuring reviews is initialized
    if (!product.reviews) {
        product.reviews = [];
    }
    // crete a new review
    const newReview = yield review_model_1.Review.create({
        reviewer: userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
    });
    // adding the new review ID to the product's reviews array
    product.reviews.push(new mongoose_1.Types.ObjectId(newReview._id));
    // calculating the new average rating
    const reviews = yield review_model_1.Review.find({ _id: { $in: product.reviews } });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    // updating the product's average rating
    product.averageRating = averageRating;
    // saving the updated product
    yield product.save();
    return product_model_1.Product.findById(product._id)
        .populate('brand')
        .populate('category')
        .populate('reviews');
});
// delete review from db
const deleteASingleProductReviewInDB = (reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.Review.findById(reviewId);
    if (!review) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    const product = yield product_model_1.Product.findOne({ reviews: reviewId });
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    // ensuring reviews is defined
    if (!product.reviews) {
        product.reviews = [];
    }
    // removing the review ID from the product's reviews array
    product.reviews = product.reviews.filter((id) => !id.equals(reviewId));
    // recalculating the average rating
    const reviews = yield review_model_1.Review.find({ _id: { $in: product.reviews } });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length ? totalRating / reviews.length : 0;
    product.averageRating = averageRating;
    // saving the updated product
    yield product.save();
    // deleting the review from the database
    yield review_model_1.Review.findByIdAndDelete(reviewId);
    return product_model_1.Product.findById(product._id)
        .populate('brand')
        .populate('category')
        .populate('reviews');
});
exports.ReviewServices = {
    addASingleProductReviewAndRatingInDB,
    deleteASingleProductReviewInDB,
};
