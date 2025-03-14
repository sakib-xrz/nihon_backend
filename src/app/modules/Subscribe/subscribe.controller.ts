import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscribeServices } from './subscribe.service';

// subscribe to news letter notifications
const subscribeToNewsLetter = catchAsync(async (req, res) => {
  const email = req.body.email;

  const result = await SubscribeServices.subscribeToNewsLetter(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscribed to news letter successfully!',
    data: result,
  });
});

export const SubscribeControllers = {
  subscribeToNewsLetter,
};
