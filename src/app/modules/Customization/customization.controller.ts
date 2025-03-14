import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomizationServices } from './customization.service';

// get customization from db
const getCustomizationFromDB = catchAsync(async (req, res) => {
  const result = await CustomizationServices.getCustomizationFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customization fetched successfully!',
    data: result,
  });
});

// update or add customization
const addOrUpdateCustomizationInDB = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await CustomizationServices.addOrUpdateCustomizationInDB(
    req.file,
    data,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customization updated successfully!',
    data: result,
  });
});

// update or add carousel
const updateCarouselInDB = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await CustomizationServices.updateCarouselInDB(req.file, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Carousel updated successfully!',
    data: result,
  });
});

export const CustomizationControllers = {
  getCustomizationFromDB,
  addOrUpdateCustomizationInDB,
  updateCarouselInDB,
};
