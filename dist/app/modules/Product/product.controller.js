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
exports.ProductControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
// get all products
const getAllProductsFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.getAllProductsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All products fetched successfully!',
        meta: result.meta,
        data: result.result,
    });
}));
// single product get
const getSingleProductFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.getSingleProductFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single product fetched successfully!',
        data: result,
    });
}));
// add a product
const addProductInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    let files;
    if (Array.isArray(req.files)) {
        files = req.files;
    }
    else if (req.files && typeof req.files === 'object') {
        files = Object.values(req.files).flat();
    }
    const result = yield product_service_1.ProductServices.addProductInDB(files, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product added successfully!',
        data: result,
    });
}));
// update product images
const updateProductImagesInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    let files = [];
    if (Array.isArray(req.files)) {
        files = req.files;
    }
    else if (req.files && typeof req.files === 'object') {
        files = Object.values(req.files).flat();
    }
    const result = yield product_service_1.ProductServices.updateProductImagesInDB(_id, files);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product images updated successfully!',
        data: result,
    });
}));
// update product details
const updateProductDetailsInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const data = req.body;
    const result = yield product_service_1.ProductServices.updateProductDetailsInDB(_id, data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product details updated successfully!',
        data: result,
    });
}));
// delete a product ( only admin can delete - softDelete )
const deleteSingleProductFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.ProductServices.deleteSingleProductFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product deleted successfully!',
        data: result,
    });
}));
// change product on market status
const updateProductOnMarketStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product_id = req.params.id;
    const payload = req.body;
    const result = yield product_service_1.ProductServices.updateProductOnMarketStatus(product_id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product on market status updated successfully!',
        data: result,
    });
}));
// delete product image
const deleteProductImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: _id } = req.params;
    const { imageUrl } = req.body;
    const result = yield product_service_1.ProductServices.deleteProductImageFromDB(_id, imageUrl);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Product image deleted successfully!',
        data: result,
    });
}));
exports.ProductControllers = {
    getAllProductsFromDB,
    getSingleProductFromDB,
    addProductInDB,
    updateProductImagesInDB,
    updateProductDetailsInDB,
    deleteSingleProductFromDB,
    updateProductOnMarketStatus,
    deleteProductImage,
};
