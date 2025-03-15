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
exports.BrandServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const mongoose_1 = __importDefault(require("mongoose"));
const brand_model_1 = require("./brand.model");
// get all brands
const getAllBrandsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield brand_model_1.Brand.find({ isDeleted: false });
    if (result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'No brand found in database !');
    }
    return result;
});
// single brand get
const getSingleBrandFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the brand exists
    const isBrandExists = yield brand_model_1.Brand.isBrandExistsByIdAndNotDeleted(_id);
    // if exists throwing error
    if (!isBrandExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This brand dose not exists !');
    }
    return isBrandExists;
});
// add a brand
const addBrandInDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const random = Math.floor(Math.random() * 1000);
        if (file) {
            const imageName = `${payload === null || payload === void 0 ? void 0 : payload.name}-${random}`;
            const path = file === null || file === void 0 ? void 0 : file.path;
            // Send image to Cloudinary
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            payload.image = secure_url;
        }
        const result = yield brand_model_1.Brand.create([payload], { session });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// update a brand
const updateSingleBrandInDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const _id = payload._id;
        // checking if the brand exists
        const isBrandExists = yield brand_model_1.Brand.isBrandExistsByIdAndNotDeleted(_id);
        // if exists throwing error
        if (!isBrandExists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This brand dose not exists !');
        }
        const random = Math.floor(Math.random() * 1000);
        if (file) {
            const imageName = `${payload === null || payload === void 0 ? void 0 : payload.name}-${random}`;
            const path = file === null || file === void 0 ? void 0 : file.path;
            // Send image to Cloudinary
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            payload.image = secure_url;
        }
        const result = yield brand_model_1.Brand.findByIdAndUpdate(_id, Object.assign({}, payload), { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// delete a brand ( only admin can delete - softDelete )
const deleteSingleBrandFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the brand exists
    const isBrandExists = yield brand_model_1.Brand.isBrandExistsByIdAndNotDeleted(_id);
    // if exists throwing error
    if (!isBrandExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This brand dose not exists !');
    }
    // updating the brand
    yield brand_model_1.Brand.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
    return null;
});
exports.BrandServices = {
    addBrandInDB,
    getAllBrandsFromDB,
    getSingleBrandFromDB,
    deleteSingleBrandFromDB,
    updateSingleBrandInDB,
};
