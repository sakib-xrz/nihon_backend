"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImagesToCloudinary = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config"));
const path_1 = __importDefault(require("path"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
// send a single image to cloudinary
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, { public_id: imageName.trim() }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            // delete a file asynchronously
            fs_1.default.unlink(path, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('File is deleted.');
                }
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
// send multiple images to cloudinary
const sendImagesToCloudinary = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = files.map((file) => {
        if (!file) {
            return Promise.reject(new Error('File is undefined'));
        }
        if (!file.originalname) {
            return Promise.reject(new Error('Original name of the file is undefined'));
        }
        const imageName = file.originalname.split('.')[0] + '-' + Date.now();
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload(file.path, { public_id: imageName.trim() }, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
                // delete file asynchronously
                fs_1.default.unlink(file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File is deleted.');
                    }
                });
            });
        });
    });
    const results = yield Promise.all(uploadPromises);
    return results.map((result) => result.secure_url);
});
exports.sendImagesToCloudinary = sendImagesToCloudinary;
// directory where files will be stored
const uploadDir = path_1.default.join(process.cwd(), '/uploads/');
// ensuring the directory exists
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true }); // creating the directory if it doesn't exist
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
