/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TCategory = {
  _id: string;
  name: string;
  image: string;
  isDeleted: boolean;
};

export interface CategoryModel extends Model<TCategory> {
  //instance methods for checking if the user exist
  isCategoryExistsByIdAndNotDeleted(
    id: Types.ObjectId | string,
  ): Promise<TCategory>;
}
