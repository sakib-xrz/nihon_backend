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
exports.ProductServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = require("./product.model");
const category_model_1 = require("../Category/category.model");
const brand_model_1 = require("../Brand/brand.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const product_constants_1 = require("./product.constants");
// get all products
const getAllProductsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find({
        isDeleted: false,
    })
        .populate('category')
        .populate('brand')
        .populate('reviews')
        .populate({
        path: 'reviews',
        populate: {
            path: 'reviewer',
            model: 'User',
            select: '_id name gender',
        },
    }), query)
        .search(product_constants_1.ProductsSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return {
        meta,
        result,
    };
});
// single product get
const getSingleProductFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the product exists
    const isProductExists = yield product_model_1.Product.isProductExistsByIdAndNotDeleted(_id);
    // if exists throwing error
    if (!isProductExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This product dose not exists !');
    }
    const result = yield product_model_1.Product.findById({
        _id,
        isDeleted: false,
    })
        .populate('category')
        .populate('brand')
        .populate('reviews')
        .populate({
        path: 'reviews',
        populate: {
            path: 'reviewer',
            model: 'User',
            select: '_id name gender',
        },
    });
    return result;
});
// add a product
const addProductInDB = (files, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, brand, discount } = payload;
    // checking if the category exists
    const isCategoryExists = yield category_model_1.Category.isCategoryExistsByIdAndNotDeleted((category === null || category === void 0 ? void 0 : category.toString()) || '');
    if (!isCategoryExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Category not found!');
    }
    // checking if the brand exists
    const isBrandExists = yield brand_model_1.Brand.isBrandExistsByIdAndNotDeleted(brand);
    if (!isBrandExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Brand not found!');
    }
    // validate discount (if provided)
    if (discount) {
        if (discount.type === 'percentage' && discount.value > 100) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100.');
        }
        if (discount.startDate &&
            discount.endDate &&
            new Date(discount.endDate) < new Date(discount.startDate)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Discount end date cannot be earlier than start date.');
        }
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (files) {
            const imageUrls = yield (0, sendImageToCloudinary_1.sendImagesToCloudinary)(files);
            payload.images = imageUrls;
        }
        const result = yield product_model_1.Product.create([payload], { session });
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
// update product images
const updateProductImagesInDB = (_id, files, index) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the product exists
    const product = yield product_model_1.Product.findById(_id);
    if (!product || product.isDeleted) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This product does not exist!');
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const imageUrls = yield (0, sendImageToCloudinary_1.sendImagesToCloudinary)(files);
        if (!imageUrls.length) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No image was uploaded.');
        }
        const newImageUrl = imageUrls[0];
        if (typeof index === 'number' && index !== -1) {
            // Update an existing image at the specified index
            if (index >= product.images.length) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid image index for update.');
            }
            product.images[index] = newImageUrl;
        }
        else {
            // Add new image if the maximum limit (3) is not reached
            if (product.images.length >= 3) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Maximum images limit reached.');
            }
            product.images.push(newImageUrl);
        }
        yield product.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return product;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
// update product details
const updateProductDetailsInDB = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, brand, discount } = payload;
    // checking if the product exists
    const isProductExists = yield product_model_1.Product.isProductExistsByIdAndNotDeleted(_id);
    if (!isProductExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This product does not exist!');
    }
    if (category) {
        // checking if the category exists
        const isCategoryExists = yield category_model_1.Category.isCategoryExistsByIdAndNotDeleted((category === null || category === void 0 ? void 0 : category.toString()) || '');
        if (!isCategoryExists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Category not found!');
        }
    }
    if (brand) {
        // Checking if the brand exists
        const isBrandExists = yield brand_model_1.Brand.isBrandExistsByIdAndNotDeleted((brand === null || brand === void 0 ? void 0 : brand.toString()) || '');
        if (!isBrandExists) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Brand not found!');
        }
    }
    // validate discount (if provided)
    if (discount) {
        if (discount.type === 'percentage' && discount.value > 100) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Percentage discount cannot exceed 100.');
        }
        if (discount.startDate &&
            discount.endDate &&
            new Date(discount.endDate) < new Date(discount.startDate)) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Discount end date cannot be earlier than start date.');
        }
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const result = yield product_model_1.Product.findByIdAndUpdate(_id, payload, {
            new: true,
            session,
        })
            .populate('category')
            .populate('brand');
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
// Delete product image -
const deleteProductImageFromDB = (_id, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.isProductExistsByIdAndNotDeleted(_id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This product does not exist!');
    }
    const imageIndex = product.images.findIndex((img) => img === imageUrl);
    if (imageIndex === -1) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Image not found in this product!');
    }
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedImages = [...product.images];
        updatedImages.splice(imageIndex, 1);
        const result = yield product_model_1.Product.findByIdAndUpdate(_id, { images: updatedImages }, { new: true, session });
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
// delete a product ( only admin can delete - softDelete )
const deleteSingleProductFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the product exists
    const isProductExists = yield product_model_1.Product.isProductExistsByIdAndNotDeleted(_id);
    // if exists throwing error
    if (!isProductExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This product dose not exists !');
    }
    // updating the category
    yield product_model_1.Product.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
    return null;
});
// change product on market status
const updateProductOnMarketStatus = (product_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the product already exists
    const isProductExists = yield product_model_1.Product.findById(product_id);
    if (!isProductExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
    }
    // update product on market status
    const updatedProduct = yield product_model_1.Product.findByIdAndUpdate(product_id, payload, {
        new: true,
    });
    return updatedProduct;
});
exports.ProductServices = {
    getAllProductsFromDB,
    getSingleProductFromDB,
    addProductInDB,
    updateProductImagesInDB,
    updateProductDetailsInDB,
    deleteProductImageFromDB,
    deleteSingleProductFromDB,
    updateProductOnMarketStatus,
};
