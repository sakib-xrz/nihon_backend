import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TProduct } from './product.interface';
import { TFile } from '../../types/types';
import mongoose from 'mongoose';
import { Product } from './product.model';
import { Category } from '../Category/category.model';
import { Brand } from '../Brand/brand.model';
import { sendImagesToCloudinary } from '../../utils/sendImageToCloudinary';
import QueryBuilder from '../../builder/QueryBuilder';
import { ProductsSearchableFields } from './product.constants';

// get all products
const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(
    Product.find({
      isDeleted: false,
    })
      .populate('category')
      .populate('brand')
      .populate('reviews')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviewer',
          model: 'User',
          select: '_id name gender',
        },
      }),
    query,
  )
    .search(ProductsSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

// single product get
const getSingleProductFromDB = async (_id: string) => {
  // checking if the product exists
  const isProductExists = await Product.isProductExistsByIdAndNotDeleted(_id);

  // if exists throwing error
  if (!isProductExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This product dose not exists !',
    );
  }

  const result = await Product.findById({
    _id,
    isDeleted: false,
  })
    .populate('category')
    .populate('brand')
    .populate('reviews')
    .populate({
      path: 'reviews',
      populate: {
        path: 'reviewer',
        model: 'User',
        select: '_id name gender',
      },
    });

  return result;
};

// add a product
const addProductInDB = async (
  files: TFile[] | undefined,
  payload: TProduct,
) => {
  const { category, brand, discount } = payload;

  // checking if the category exists
  const isCategoryExists = await Category.isCategoryExistsByIdAndNotDeleted(
    category?.toString() || '',
  );

  if (!isCategoryExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category not found!');
  }

  // checking if the brand exists
  const isBrandExists = await Brand.isBrandExistsByIdAndNotDeleted(brand);

  if (!isBrandExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Brand not found!');
  }

  // validate discount (if provided)
  if (discount) {
    if (discount.type === 'percentage' && discount.value > 100) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Percentage discount cannot exceed 100.',
      );
    }
    if (
      discount.startDate &&
      discount.endDate &&
      new Date(discount.endDate) < new Date(discount.startDate)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Discount end date cannot be earlier than start date.',
      );
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (files) {
      const imageUrls = await sendImagesToCloudinary(files);
      payload.images = imageUrls;
    }

    const result = await Product.create([payload], { session });

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// update product images
const updateProductImagesInDB = async (
  _id: string,
  files: TFile[],
  index?: number,
) => {
  // checking if the product exists
  const product = await Product.findById(_id);
  if (!product || product.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This product does not exist!');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const imageUrls = await sendImagesToCloudinary(files);

    if (!imageUrls.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'No image was uploaded.');
    }
    const newImageUrl = imageUrls[0];

    if (typeof index === 'number' && index !== -1) {
      // Update an existing image at the specified index
      if (index >= product.images.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid image index for update.',
        );
      }
      product.images[index] = newImageUrl;
    } else {
      // Add new image if the maximum limit (3) is not reached
      if (product.images.length >= 3) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Maximum images limit reached.',
        );
      }
      product.images.push(newImageUrl);
    }

    await product.save({ session });
    await session.commitTransaction();
    session.endSession();

    return product;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// update product details
const updateProductDetailsInDB = async (
  _id: string,
  payload: Partial<TProduct>,
) => {
  const { category, brand, discount } = payload;

  // checking if the product exists
  const isProductExists = await Product.isProductExistsByIdAndNotDeleted(_id);

  if (!isProductExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This product does not exist!');
  }

  if (category) {
    // checking if the category exists
    const isCategoryExists = await Category.isCategoryExistsByIdAndNotDeleted(
      category?.toString() || '',
    );

    if (!isCategoryExists) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Category not found!');
    }
  }

  if (brand) {
    // Checking if the brand exists
    const isBrandExists = await Brand.isBrandExistsByIdAndNotDeleted(
      brand?.toString() || '',
    );

    if (!isBrandExists) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Brand not found!');
    }
  }

  // validate discount (if provided)
  if (discount) {
    if (discount.type === 'percentage' && discount.value > 100) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Percentage discount cannot exceed 100.',
      );
    }
    if (
      discount.startDate &&
      discount.endDate &&
      new Date(discount.endDate) < new Date(discount.startDate)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Discount end date cannot be earlier than start date.',
      );
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await Product.findByIdAndUpdate(_id, payload, {
      new: true,
      session,
    })
      .populate('category')
      .populate('brand');

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Delete product image -
const deleteProductImageFromDB = async (_id: string, imageUrl: string) => {
  const product = await Product.isProductExistsByIdAndNotDeleted(_id);
  if (!product) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This product does not exist!');
  }

  const imageIndex = product.images.findIndex((img) => img === imageUrl);
  if (imageIndex === -1) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Image not found in this product!',
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updatedImages = [...product.images];
    updatedImages.splice(imageIndex, 1);
    const result = await Product.findByIdAndUpdate(
      _id,
      { images: updatedImages },
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

// delete a product ( only admin can delete - softDelete )
const deleteSingleProductFromDB = async (_id: string) => {
  // checking if the product exists
  const isProductExists = await Product.isProductExistsByIdAndNotDeleted(_id);
  // if exists throwing error
  if (!isProductExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This product dose not exists !',
    );
  }
  // updating the category
  await Product.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
  return null;
};

// change product on market status
const updateProductOnMarketStatus = async (
  product_id: string,
  payload: { isOnMarketStatus: 'onMarket' | 'pre-order' },
) => {
  // check if the product already exists
  const isProductExists = await Product.findById(product_id);
  if (!isProductExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // update product on market status
  const updatedProduct = await Product.findByIdAndUpdate(product_id, payload, {
    new: true,
  });
  return updatedProduct;
};

export const ProductServices = {
  getAllProductsFromDB,
  getSingleProductFromDB,
  addProductInDB,
  updateProductImagesInDB,
  updateProductDetailsInDB,
  deleteProductImageFromDB,
  deleteSingleProductFromDB,
  updateProductOnMarketStatus,
};
