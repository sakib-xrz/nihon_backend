/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { TUserGender, TUserRole, TUserStatus } from './user.constant';

export type TAuthUser = {
  userId: string;
  email: string;
  name: string;
  role: TUserRole; // Enforce the role to be "user"
  iat: number;
  exp: number;
};

export type TWishlist = {
  productId: Types.ObjectId;
};
export type TTransformedWishlist = {
  product: Types.ObjectId;
};
export type TUser = {
  id: string;
  name: string;
  gender: TUserGender;
  email: string;
  password?: string;
  image: string;
  role: TUserRole;
  wishlist: TWishlist[];
  payment_id: Types.ObjectId;
  status: TUserStatus;
  isVerified: boolean;
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByCustomId(_id: string): Promise<TUser>;
  //instance methods for checking if the user exist
  isUserExistsByEmail(email: string): Promise<TUser>;
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
