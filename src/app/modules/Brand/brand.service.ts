import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { TBrand } from './brand.interface';
import { TFile } from '../../types/types';
import mongoose from 'mongoose';
import { Brand } from './brand.model';

// get all brands
const getAllBrandsFromDB = async () => {
  const result = await Brand.find({ isDeleted: false });

  if (result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No brand found in database !');
  }

  return result;
};

// single brand get
const getSingleBrandFromDB = async (_id: string) => {
  // checking if the brand exists
  const isBrandExists = await Brand.isBrandExistsByIdAndNotDeleted(_id);
  // if exists throwing error
  if (!isBrandExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This brand dose not exists !');
  }
  return isBrandExists;
};

// add a brand
const addBrandInDB = async (file: TFile, payload: TBrand) => {
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

    const result = await Brand.create([payload], { session });

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// update a brand
const updateSingleBrandInDB = async (file: TFile, payload: Partial<TBrand>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const _id = payload._id as string;
    // checking if the brand exists
    const isBrandExists = await Brand.isBrandExistsByIdAndNotDeleted(_id);
    // if exists throwing error
    if (!isBrandExists) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This brand dose not exists !',
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

    const result = await Brand.findByIdAndUpdate(
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

// delete a brand ( only admin can delete - softDelete )
const deleteSingleBrandFromDB = async (_id: string) => {
  // checking if the brand exists
  const isBrandExists = await Brand.isBrandExistsByIdAndNotDeleted(_id);
  // if exists throwing error
  if (!isBrandExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This brand dose not exists !');
  }
  // updating the brand
  await Brand.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
  return null;
};

export const BrandServices = {
  addBrandInDB,
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  deleteSingleBrandFromDB,
  updateSingleBrandInDB,
};
