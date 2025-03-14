/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TDiscount = {
  value: number;
  type: 'percentage' | 'flat';
  startDate?: Date;
  endDate?: Date;
};

export type TProduct = {
  _id: string;
  name: string;
  desc: string;
  images: string[];
  price: number;
  in_stock: number;
  weight: number;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  imageIndexToUpdate?: number;
  reviews?: Types.ObjectId[];
  averageRating: number;
  isOnMarketStatus: 'onMarket' | 'pre-order';
  discount?: TDiscount;
  isPublished: boolean;
  isDeleted: boolean;
};

export interface ProductModel extends Model<TProduct> {
  //instance methods for checking if the user exist
  isProductExistsByIdAndNotDeleted(
    id: Types.ObjectId | string,
  ): Promise<TProduct>;
}
