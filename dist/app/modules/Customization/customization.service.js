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
exports.CustomizationServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const customization_model_1 = require("./customization.model");
// get customizations from db
const getCustomizationFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield customization_model_1.Customization.find();
    return result[0];
});
// add or update customizations
const addOrUpdateCustomizationInDB = (file, data) => __awaiter(void 0, void 0, void 0, function* () {
    // finding existing customization or creating a new one
    const customization = yield customization_model_1.Customization.findOne();
    if (!customization) {
        // creating and saving a new customization
        const newCustomization = new customization_model_1.Customization(data);
        yield newCustomization.save();
        return newCustomization;
    }
    // handling file and updating customization
    if (file) {
        const random = Math.random().toString(36).substring(7); // Generating random string
        const path = file.path;
        if (data.data === 'logo') {
            const imageName = `${data.logo}-${random}`;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            customization.logo = secure_url;
        }
        else if (data.data === 'banner_1') {
            const imageName = `${data.banner_1}-${random}`;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            customization.banner_1 = secure_url;
        }
        else if (data.data === 'banner_2') {
            const imageName = `${data.banner_2}-${random}`;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            customization.banner_2 = secure_url;
        }
        else if (data.data === 'banner_3') {
            const imageName = `${data.banner_3}-${random}`;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            customization.banner_3 = secure_url;
        }
        else if (data.data === 'banner_4') {
            const imageName = `${data.banner_4}-${random}`;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            customization.banner_4 = secure_url;
        }
        else if (data.data === 'carousel') {
            const imageName = `${'carousel'}-${random}`;
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            const newCarouselData = {
                img: secure_url,
                title: data.title,
                description: data.description,
            };
            // Ensuring `customization.carousel` is initialized as an array if it is undefined
            if (!customization.carousel) {
                customization.carousel = [];
            }
            // pushing the new carousel item to the array
            customization.carousel.push(newCarouselData);
        }
        else {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This is not a valid request!');
        }
    }
    // updating fields if provided
    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined) {
            customization[key] = data[key];
        }
    });
    // saving the updated customization
    yield customization.save();
    return customization;
});
// update or add carousel
const updateCarouselInDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, title, description } = payload;
    const carouselFromDB = yield customization_model_1.Customization.find();
    const isCarouselExists = carouselFromDB[0].carousel.find((item) => item._id.equals(_id));
    if (!isCarouselExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Carousel not found!');
    }
    if (file && _id) {
        const random = Math.random().toString(36).substring(7); // Generating random string
        const path = file.path;
        const imageName = `${'carousel'}-${random}`;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        isCarouselExists.img = secure_url;
    }
    if (title) {
        isCarouselExists.title = title;
    }
    if (description) {
        isCarouselExists.description = description;
    }
    // saving the changes back to the database:
    yield carouselFromDB[0].save();
    console.log(isCarouselExists);
    return carouselFromDB[0];
});
exports.CustomizationServices = {
    getCustomizationFromDB,
    addOrUpdateCustomizationInDB,
    updateCarouselInDB,
};
