import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import multer from 'multer';
import config from '../config';
import { TFile } from '../types/types';
import path from 'path';

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// send a single image to cloudinary
export const sendImageToCloudinary = (
  imageName: string,
  path: string | undefined,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path as string,
      { public_id: imageName.trim() },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path as string, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('File is deleted.');
          }
        });
      },
    );
  });
};

// send multiple images to cloudinary
export const sendImagesToCloudinary = async (
  files: TFile[],
): Promise<string[]> => {
  const uploadPromises = files.map((file) => {
    if (!file) {
      return Promise.reject(new Error('File is undefined'));
    }
    if (!file.originalname) {
      return Promise.reject(
        new Error('Original name of the file is undefined'),
      );
    }
    const imageName = file.originalname.split('.')[0] + '-' + Date.now();
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path!,
        { public_id: imageName.trim() },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result as UploadApiResponse);
          // delete file asynchronously
          fs.unlink(file.path!, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('File is deleted.');
            }
          });
        },
      );
    });
  });

  const results = await Promise.all(uploadPromises);
  return results.map((result) => result.secure_url);
};

// directory where files will be stored
const uploadDir = path.join(process.cwd(), '/uploads/');

// ensuring the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // creating the directory if it doesn't exist
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
