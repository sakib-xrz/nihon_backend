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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: [user_constant_1.GENDER.male, user_constant_1.GENDER.female, user_constant_1.GENDER.other],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        select: 0,
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        enum: [
            user_constant_1.USER_ROLE.superAdmin,
            user_constant_1.USER_ROLE.admin,
            user_constant_1.USER_ROLE.moderator,
            user_constant_1.USER_ROLE.user,
        ],
        default: user_constant_1.USER_ROLE.user,
    },
    status: {
        type: String,
        enum: [user_constant_1.USER_STATUS.active, user_constant_1.USER_STATUS.blocked],
        default: user_constant_1.USER_STATUS.active,
    },
    wishlist: [
        {
            type: {
                productId: mongoose_1.Schema.Types.ObjectId,
            },
            ref: 'Product',
            required: true,
        },
    ],
    payment_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this; // doc
        // hashing password and save into DB
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.jwt.bcrypt_salt_rounds));
        next();
    });
});
userSchema.statics.isUserExistsByCustomId = function (_id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ _id }).select('+password');
    });
};
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)('User', userSchema);
