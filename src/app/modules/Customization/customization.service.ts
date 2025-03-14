/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TFile } from '../../types/types';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import {
  ImagePropertyType,
  UpdateCarouselPayload,
} from './customization.interface';
import { Customization } from './customization.model';

// get customizations from db
const getCustomizationFromDB = async () => {
  const result = await Customization.find();
  return result[0];
};

// add or update customizations
const addOrUpdateCustomizationInDB = async (
  file: TFile | null,
  data: Record<string, unknown>,
) => {
  // finding existing customization or creating a new one
  const customization = await Customization.findOne();

  if (!customization) {
    // creating and saving a new customization
    const newCustomization = new Customization(data);
    await newCustomization.save();
    return newCustomization;
  }
  // handling file and updating customization
  if (file) {
    const random = Math.random().toString(36).substring(7); // Generating random string
    const path = file.path;

    if (data.data === 'logo') {
      const imageName = `${data.logo}-${random}`;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      customization.logo = secure_url as string;
    } else if (data.data === 'banner_1') {
      const imageName = `${data.banner_1}-${random}`;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      customization.banner_1 = secure_url as string;
    } else if (data.data === 'banner_2') {
      const imageName = `${data.banner_2}-${random}`;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      customization.banner_2 = secure_url as string;
    } else if (data.data === 'banner_3') {
      const imageName = `${data.banner_3}-${random}`;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      customization.banner_3 = secure_url as string;
    } else if (data.data === 'banner_4') {
      const imageName = `${data.banner_4}-${random}`;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      customization.banner_4 = secure_url as string;
    } else if (data.data === 'carousel') {
      const imageName = `${'carousel'}-${random}`;
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      const newCarouselData = {
        img: secure_url,
        title: data.title as string,
        description: data.description as string,
      };

      // Ensuring `customization.carousel` is initialized as an array if it is undefined
      if (!customization.carousel) {
        customization.carousel = [];
      }

      // pushing the new carousel item to the array
      customization.carousel.push(newCarouselData as any);
    } else {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This is not a valid request!',
      );
    }
  }

  // updating fields if provided
  Object.keys(data).forEach((key) => {
    if (data[key as ImagePropertyType] !== undefined) {
      customization[key as ImagePropertyType] = data[
        key as ImagePropertyType
      ] as string;
    }
  });

  // saving the updated customization
  await customization.save();
  return customization;
};

// update or add carousel
const updateCarouselInDB = async (
  file: TFile | undefined,
  payload: UpdateCarouselPayload,
) => {
  const { _id, title, description } = payload;

  const carouselFromDB = await Customization.find();
  const isCarouselExists = carouselFromDB[0].carousel.find((item) =>
    item._id.equals(_id),
  );

  if (!isCarouselExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Carousel not found!');
  }

  if (file && _id) {
    const random = Math.random().toString(36).substring(7); // Generating random string
    const path = file.path;
    const imageName = `${'carousel'}-${random}`;
    const { secure_url } = await sendImageToCloudinary(imageName, path);

    isCarouselExists.img = secure_url as string;
  }

  if (title) {
    isCarouselExists.title = title;
  }

  if (description) {
    isCarouselExists.description = description;
  }

  // saving the changes back to the database:
  await carouselFromDB[0].save();
  console.log(isCarouselExists);
  return carouselFromDB[0];
};

export const CustomizationServices = {
  getCustomizationFromDB,
  addOrUpdateCustomizationInDB,
  updateCarouselInDB,
};
