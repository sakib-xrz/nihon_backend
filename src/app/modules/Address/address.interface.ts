/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TAddress = {
  _id: string;
  present_address: string;
  billing_address: string;
  isDeleted: boolean;
};

export interface AddressModel extends Model<TAddress> {
  //instance methods for checking if the address exist
  isAddressExistsByIdAndNotDeleted(
    id: Types.ObjectId | string,
  ): Promise<TAddress>;
}
