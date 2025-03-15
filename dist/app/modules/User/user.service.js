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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
// get me
const getMeFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const isUserExists = yield user_model_1.User.isUserExistsByCustomId(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User dose not exists !');
    }
    const result = yield user_model_1.User.findById(userId)
        .populate('wishlist')
        .populate({ path: 'wishlist.productId', model: 'Product' });
    return result;
});
// get a single user
const getASingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exists
    const isUserExists = yield user_model_1.User.isUserExistsByCustomId(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User dose not exists !');
    }
    const result = yield user_model_1.User.findById(userId)
        .populate('wishlist')
        .populate({ path: 'wishlist.productId', model: 'Product' });
    return result;
});
// get all users
const getAllUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return user_model_1.User.find()
        .populate('wishlist')
        .populate({ path: 'wishlist.productId', model: 'Product' });
});
// update user
const updateAUserInDB = (file, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = payload, restData = __rest(payload, ["email"]);
    // check if the user is exists
    const isUserExists = yield user_model_1.User.isUserExistsByCustomId(user.userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User dose not exists !');
    }
    const updateData = {};
    if (file) {
        const random = Math.floor(Math.random() * 1000);
        const imageName = `${payload === null || payload === void 0 ? void 0 : payload.name}-${random}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        try {
            const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            updateData.image = secure_url;
        }
        catch (error) {
            // Handle image upload error
            console.error('Error uploading image:', error);
            // Consider throwing an appropriate error or logging the error
        }
    }
    if (email) {
        updateData.email = email;
        updateData.isVerified = false;
    }
    if (restData) {
        Object.assign(updateData, restData);
    }
    try {
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(user.userId, updateData, {
            new: true,
        });
        if (!updatedUser) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return updatedUser;
    }
    catch (error) {
        // Handle database update error
        console.error('Error updating user:', error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update user');
    }
});
// update wishlist
const updateWishlistInDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check if user exists
    const isUserExists = yield user_model_1.User.isUserExistsByCustomId(user.userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User does not exist!');
    }
    // 2. Retrieve current wishlist and convert product IDs to a set for efficient lookup
    const currentWishlist = isUserExists.wishlist || [];
    const currentWishlistProductIds = new Set(currentWishlist.map((item) => item.productId.toString()));
    // 3. Prepare updated wishlist with efficient addition/removal logic
    const updatedWishlist = currentWishlist.filter((item) => {
        // Keep items in the wishlist that are not in the payload
        return !payload.some((newItem) => newItem.productId.toString() === item.productId.toString());
    });
    payload.forEach((newItem) => {
        // Add new items from the payload to the wishlist
        if (!currentWishlistProductIds.has(newItem.productId.toString())) {
            updatedWishlist.push(newItem);
        }
    });
    // 4. Update user document with the modified wishlist
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(user.userId, { wishlist: updatedWishlist }, { new: true });
    if (!updatedUser) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to update wishlist');
    }
    return updatedUser.wishlist;
});
exports.UserServices = {
    updateAUserInDB,
    updateWishlistInDB,
    getAllUsersFromDB,
    getMeFromDb,
    getASingleUser,
};
