/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';
import { GENDER, USER_ROLE, USER_STATUS } from './user.constant';
const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: [GENDER.male, GENDER.female, GENDER.other],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: 0,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.moderator,
        USER_ROLE.user,
      ],
      default: USER_ROLE.user,
    },
    status: {
      type: String,
      enum: [USER_STATUS.active, USER_STATUS.blocked],
      default: USER_STATUS.active,
    },

    wishlist: [
      {
        type: {
          productId: Schema.Types.ObjectId,
        },
        ref: 'Product',
        required: true,
      },
    ],

    payment_id: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password as string,
    Number(config.jwt.bcrypt_salt_rounds),
  );

  next();
});

userSchema.statics.isUserExistsByCustomId = async function (_id: string) {
  return await User.findOne({ _id }).select('+password');
};
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);
