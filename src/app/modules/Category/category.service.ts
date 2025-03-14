import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { TFile } from '../../types/types';
import { TCategory } from './category.interface';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Category } from './category.model';

// get all categories
const getAllCategoriesFromDB = async () => {
  const result = await Category.find({ isDeleted: false });

  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No category found in database !');
  }

  return result;
};

// single category get
const getSingleCategoryFromDB = async (_id: string) => {
  // checking if the category exists
  const isCategoryExists =
    await Category.isCategoryExistsByIdAndNotDeleted(_id);
  // if exists throwing error
  if (!isCategoryExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This category dose not exists !',
    );
  }
  return isCategoryExists;
};

// add a category
const addCategoryInDB = async (file: TFile, payload: TCategory) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const random = Math.floor(Math.random() * 1000);

    if (file) {
      const imageName = `${payload?.name}-${random}`;
      const path = file?.path;
      // Send image to Cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.image = secure_url as string;
    }

    const result = await Category.create([payload], { session });

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// update a category
const updateSingleCategoryInDB = async (
  file: TFile,
  payload: Partial<TCategory>,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const _id = payload._id as string;
    // checking if the category exists
    const isBrandExists = await Category.isCategoryExistsByIdAndNotDeleted(_id);
    // if exists throwing error
    if (!isBrandExists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This category dose not exists !',
      );
    }

    const random = Math.floor(Math.random() * 1000);

    if (file) {
      const imageName = `${payload?.name}-${random}`;
      const path = file?.path;
      // Send image to Cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.image = secure_url as string;
    }

    const result = await Category.findByIdAndUpdate(
      _id,
      { ...payload },
      { new: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// delete a category ( only admin can delete - softDelete )
const deleteSingleCategoryFromDB = async (_id: string) => {
  // checking if the category exists
  const isBrandExists = await Category.isCategoryExistsByIdAndNotDeleted(_id);
  // if exists throwing error
  if (!isBrandExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This category dose not exists !',
    );
  }
  // updating the category
  await Category.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
  return null;
};

export const CategoryServices = {
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  addCategoryInDB,
  updateSingleCategoryInDB,
  deleteSingleCategoryFromDB,
};
