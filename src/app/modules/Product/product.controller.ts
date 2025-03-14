import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';
import { TFile } from '../../types/types';

// get all products
const getAllProductsFromDB = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All products fetched successfully!',
    meta: result.meta,
    data: result.result,
  });
});

// single product get
const getSingleProductFromDB = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single product fetched successfully!',
    data: result,
  });
});

// add a product
const addProductInDB = catchAsync(async (req, res) => {
  const data = req.body;
  let files: TFile[] | undefined;

  if (Array.isArray(req.files)) {
    files = req.files as TFile[];
  } else if (req.files && typeof req.files === 'object') {
    files = Object.values(req.files).flat() as TFile[];
  }

  const result = await ProductServices.addProductInDB(files, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product added successfully!',
    data: result,
  });
});

// update product images
const updateProductImagesInDB = catchAsync(async (req, res) => {
  const _id = req.params.id;
  let files: TFile[] = [];

  if (Array.isArray(req.files)) {
    files = req.files as TFile[];
  } else if (req.files && typeof req.files === 'object') {
    files = Object.values(req.files).flat() as TFile[];
  }

  const result = await ProductServices.updateProductImagesInDB(_id, files);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product images updated successfully!',
    data: result,
  });
});

// update product details
const updateProductDetailsInDB = catchAsync(async (req, res) => {
  const _id = req.params.id;
  const data = req.body;

  const result = await ProductServices.updateProductDetailsInDB(_id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product details updated successfully!',
    data: result,
  });
});

// delete a product ( only admin can delete - softDelete )
const deleteSingleProductFromDB = catchAsync(async (req, res) => {
  const result = await ProductServices.deleteSingleProductFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

// change product on market status
const updateProductOnMarketStatus = catchAsync(async (req, res) => {
  const product_id = req.params.id;
  const payload = req.body;
  const result = await ProductServices.updateProductOnMarketStatus(
    product_id,
    payload,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product on market status updated successfully!',
    data: result,
  });
});

// delete product image
const deleteProductImage = catchAsync(async (req, res) => {
  const { id: _id } = req.params;
  const { imageUrl } = req.body;
  const result = await ProductServices.deleteProductImageFromDB(_id, imageUrl);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product image deleted successfully!',
    data: result,
  });
});

export const ProductControllers = {
  getAllProductsFromDB,
  getSingleProductFromDB,
  addProductInDB,
  updateProductImagesInDB,
  updateProductDetailsInDB,
  deleteSingleProductFromDB,
  updateProductOnMarketStatus,
  deleteProductImage,
};
