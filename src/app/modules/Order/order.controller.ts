import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';
import AppError from '../../errors/AppError';

// get orders by user
const getAllOrdersByUserIDFromDB = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await OrderServices.getAllOrdersByUserIDFromDB(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders fetched successfully!',
    data: result,
  });
});

// get orders by user
const getAllOrdersFromDBForAdminPanel = catchAsync(async (req, res) => {
  const user = req.user;

  // checking if the user has the required role
  if (['superAdmin', 'admin', 'moderator'].includes(user.role)) {
    const result = await OrderServices.getAllOrdersFromDBForAdminPanel();
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Orders fetched successfully!',
      data: result,
    });
  }
  throw new AppError(
    httpStatus.BAD_REQUEST,
    'This user dose not have required permission to access this api !',
  );
});

// update order
const updateAOrderInDB = catchAsync(async (req, res) => {
  const orderId = req.params.orderId;
  const orderUpdates = req.body;
  const result = await OrderServices.updateAOrderInDB(orderId, orderUpdates);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully!',
    data: result,
  });
});

export const OrderControllers = {
  getAllOrdersByUserIDFromDB,
  getAllOrdersFromDBForAdminPanel,
  updateAOrderInDB,
};
