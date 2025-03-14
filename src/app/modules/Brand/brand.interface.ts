/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TBrand = {
  _id: string;
  name: string;
  desc: string;
  image: string;
  isDeleted: boolean;
};

export interface BrandModel extends Model<TBrand> {
  //instance methods for checking if the user exist
  isBrandExistsByIdAndNotDeleted(id: Types.ObjectId | string): Promise<TBrand>;
}
