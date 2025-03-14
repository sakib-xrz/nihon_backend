import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import { TAuthUser } from './user.interface';

// get me
const getMeFromDb = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await UserServices.getMeFromDb(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully!',
    data: result,
  });
});

// get a single user
const getASingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.getMeFromDb(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully!',
    data: result,
  });
});

// update a user in DB
const updateAUserInDB = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await UserServices.updateAUserInDB(
    req.file,
    data,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});
// update wishlist in DB
const updateWishlistInDB = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await UserServices.updateWishlistInDB(
    data,
    req.user as TAuthUser,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wishlist updated successfully!',
    data: result,
  });
});
// get all users from DB
const getAllUsersFromDB = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All users fetched successfully!',
    data: result,
  });
});

export const UserController = {
  updateAUserInDB,
  updateWishlistInDB,
  getAllUsersFromDB,
  getMeFromDb,
  getASingleUser,
};
