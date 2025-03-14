import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BrandServices } from './brand.service';

// get all brands
const getAllBrandsFromDB = catchAsync(async (req, res) => {
  const result = await BrandServices.getAllBrandsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All brands fetched successfully!',
    data: result,
  });
});

// single product get
const getSingleBrandFromDB = catchAsync(async (req, res) => {
  const result = await BrandServices.getSingleBrandFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single brand fetched successfully!',
    data: result,
  });
});

// add a brand
const addBrandInDB = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await BrandServices.addBrandInDB(req.file, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand added successfully!',
    data: result,
  });
});

// update a brand
const updateSingleBrandInDB = catchAsync(async (req, res) => {
  const data = req.body;
  data._id = req.params.id;
  const result = await BrandServices.updateSingleBrandInDB(req.file, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand updated successfully!',
    data: result,
  });
});

// delete a brand ( only admin can delete - softDelete )
const deleteSingleBrandFromDB = catchAsync(async (req, res) => {
  const result = await BrandServices.deleteSingleBrandFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand deleted successfully!',
    data: result,
  });
});

export const BrandControllers = {
  addBrandInDB,
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  deleteSingleBrandFromDB,
  updateSingleBrandInDB,
};
