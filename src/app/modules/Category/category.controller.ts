import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CategoryServices } from './category.service';

// get all categories
const getAllCategoriesFromDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All categories fetched successfully!',
    data: result,
  });
});

// single category get
const getSingleCategoryFromDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.getSingleCategoryFromDB(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single category fetched successfully!',
    data: result,
  });
});

// add a category
const addCategoryInDB = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await CategoryServices.addCategoryInDB(req.file, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category added successfully!',
    data: result,
  });
});

// update a category
const updateSingleCategoryInDB = catchAsync(async (req, res) => {
  const data = req.body;
  data._id = req.params.id;
  const result = await CategoryServices.updateSingleCategoryInDB(
    req.file,
    data,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated successfully!',
    data: result,
  });
});

// delete a category ( only admin can delete - softDelete )
const deleteSingleCategoryFromDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.deleteSingleCategoryFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category deleted successfully!',
    data: result,
  });
});

export const CategoryControllers = {
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  addCategoryInDB,
  updateSingleCategoryInDB,
  deleteSingleCategoryFromDB,
};
