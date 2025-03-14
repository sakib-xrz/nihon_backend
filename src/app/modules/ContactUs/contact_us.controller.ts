import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactUsServices } from './contact_us.service';

// contact us
const addContactUsDataToDB = catchAsync(async (req, res) => {
  const contact_us_data = req.body;
  await ContactUsServices.addContactUsDataToDB(contact_us_data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Thank you for contacting us. We will get back to you shortly.',
    data: null,
  });
});

// update contact us status
const updateContactUsStatus = catchAsync(async (req, res) => {
  const { id, is_contacted } = req.body;
  await ContactUsServices.updateContactUsStatus(id, is_contacted);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact us data status updated successfully',
    data: null,
  });
});
export const ContactUsControllers = {
  addContactUsDataToDB,
  updateContactUsStatus,
};
