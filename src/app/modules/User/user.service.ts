import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TAuthUser, TUser, TWishlist } from './user.interface';
import { User } from './user.model';
import { TFile } from '../../types/types';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

// get me
const getMeFromDb = async (userId: string) => {
  // check if the user is exists
  const isUserExists = await User.isUserExistsByCustomId(userId as string);

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User dose not exists !');
  }

  const result = await User.findById(userId)
    .populate('wishlist')
    .populate({ path: 'wishlist.productId', model: 'Product' });

  return result;
};

// get a single user
const getASingleUser = async (userId: string) => {
  // check if the user is exists
  const isUserExists = await User.isUserExistsByCustomId(userId as string);

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User dose not exists !');
  }

  const result = await User.findById(userId)
    .populate('wishlist')
    .populate({ path: 'wishlist.productId', model: 'Product' });

  return result;
};

// get all users
const getAllUsersFromDB = async () => {
  return User.find()
    .populate('wishlist')
    .populate({ path: 'wishlist.productId', model: 'Product' });
};

// update user
const updateAUserInDB = async (
  file: TFile | undefined,
  payload: Partial<TUser>,
  user: TAuthUser,
) => {
  const { email, ...restData } = payload;

  // check if the user is exists
  const isUserExists = await User.isUserExistsByCustomId(user.userId as string);

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User dose not exists !');
  }

  const updateData: Partial<TUser> = {};

  if (file) {
    const random = Math.floor(Math.random() * 1000);
    const imageName = `${payload?.name}-${random}`;
    const path = file?.path;

    try {
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      updateData.image = secure_url as string;
    } catch (error) {
      // Handle image upload error
      console.error('Error uploading image:', error);
      // Consider throwing an appropriate error or logging the error
    }
  }

  if (email) {
    updateData.email = email;
    updateData.isVerified = false;
  }

  if (restData) {
    Object.assign(updateData, restData);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(user.userId, updateData, {
      new: true,
    });
    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }
    return updatedUser;
  } catch (error) {
    // Handle database update error
    console.error('Error updating user:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update user',
    );
  }
};

// update wishlist
const updateWishlistInDB = async (payload: TWishlist[], user: TAuthUser) => {
  // 1. Check if user exists
  const isUserExists = await User.isUserExistsByCustomId(user.userId as string);

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist!');
  }

  // 2. Retrieve current wishlist and convert product IDs to a set for efficient lookup
  const currentWishlist = isUserExists.wishlist || [];
  const currentWishlistProductIds = new Set(
    currentWishlist.map((item: TWishlist) => item.productId.toString()),
  );

  // 3. Prepare updated wishlist with efficient addition/removal logic
  const updatedWishlist = currentWishlist.filter((item) => {
    // Keep items in the wishlist that are not in the payload
    return !payload.some(
      (newItem) => newItem.productId.toString() === item.productId.toString(),
    );
  });

  payload.forEach((newItem) => {
    // Add new items from the payload to the wishlist
    if (!currentWishlistProductIds.has(newItem.productId.toString())) {
      updatedWishlist.push(newItem);
    }
  });

  // 4. Update user document with the modified wishlist
  const updatedUser = await User.findByIdAndUpdate(
    user.userId,
    { wishlist: updatedWishlist },
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update wishlist',
    );
  }

  return updatedUser.wishlist;
};

export const UserServices = {
  updateAUserInDB,
  updateWishlistInDB,
  getAllUsersFromDB,
  getMeFromDb,
  getASingleUser,
};
