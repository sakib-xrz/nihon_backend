import mongoose, { Schema } from 'mongoose';
import { TReview } from './review.interface';

// review schema
const reviewSchema = new Schema<TReview>({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
  },
});
export const Review = mongoose.model('Review', reviewSchema);
