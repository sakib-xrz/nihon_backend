import { Types } from 'mongoose';

export type TReview = {
  _id: string;
  reviewer: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
};
