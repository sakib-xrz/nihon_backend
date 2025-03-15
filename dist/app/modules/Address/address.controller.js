"use strict";
// import httpStatus from 'http-status';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import { AddressServices } from './address.service';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressControllers = void 0;
// // single address get
// const getSingleAddressFromDB = catchAsync(async (req, res) => {
//   const result = await AddressServices.getSingleAddressFromDB(req.params.id);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Single address fetched successfully!',
//     data: result,
//   });
// });
// // add a address
// const addAddressInDB = catchAsync(async (req, res) => {
//   const data = req.body;
//   const result = await AddressServices.addAddressInDB(req.file, data);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Address added successfully!',
//     data: result,
//   });
// });
// // update a address
// const updateSingleAddressInDB = catchAsync(async (req, res) => {
//   const data = req.body;
//   data._id = req.params.id;
//   const result = await AddressServices.updateSingleAddressInDB(req.file, data);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Address updated successfully!',
//     data: result,
//   });
// });
// // delete a address ( only admin can delete - softDelete )
// const deleteDeleteCategoryFromDB = catchAsync(async (req, res) => {
//   const result = await AddressServices.deleteDeleteCategoryFromDB(
//     req.params.id,
//   );
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Address deleted successfully!',
//     data: result,
//   });
// });
exports.AddressControllers = {
// getSingleAddressFromDB,
// addAddressInDB,
// updateSingleAddressInDB,
// deleteDeleteCategoryFromDB,
};
