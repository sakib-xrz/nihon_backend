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
exports.AuthServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendEmail_1 = require("../../utils/sendEmail");
const user_model_1 = require("../User/user.model");
const auth_utils_1 = require("./auth.utils");
const user_constant_1 = require("../User/user.constant");
const auth_email_template_1 = require("./auth.email_template");
const auth_model_1 = require("./auth.model");
// register new user
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user exists
    const isEmailExists = yield user_model_1.User.isUserExistsByEmail(payload.email);
    // if exists throwing error
    if (isEmailExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This user already exists !');
    }
    // creating the user
    const result = yield user_model_1.User.create(payload);
    // removing password from response
    const userObject = result.toObject();
    delete userObject.password;
    // returning obj
    return userObject;
});
// login user
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(payload.email);
    // if user not exists then throwing error
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    //checking if the password is correct
    const isPasswordMatched = yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    console.log(isPasswordMatched);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    //create token and sent to the  client
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.jwt_refresh_secret, config_1.default.jwt.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
// refresh token revalidate to generate new access token
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt.jwt_refresh_secret);
    const { userId } = decoded;
    //github.com/dev-niloy/nihon-beauty-backend-server
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByCustomId(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.jwt_access_secret, config_1.default.jwt.jwt_access_expires_in);
    return {
        accessToken,
    };
});
// change password
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByCustomId(userData.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === user_constant_1.USER_STATUS.blocked) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    //checking if the password is correct
    const isPasswordMatched = yield user_model_1.User.isPasswordMatched(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    //hash new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.jwt.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        _id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
    });
    return null;
});
// forget password otp send
const forgetPassword_otp_send = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(userEmail);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted !');
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked ! !');
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.jwt_access_secret, '10m');
    // here create a system if the link is use one to reset password the token will be invalidate
    const resetUILink = `${config_1.default.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;
    // creating a record for the token in the database
    yield auth_model_1.PasswordResetToken.create({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    const emailContent = (0, auth_email_template_1.htmlTemplate)(resetUILink);
    yield (0, sendEmail_1.sendEmail)(user.email, emailContent);
});
// forgot password
const forgotPassword = (userId, token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const validateTokenFromDB = yield auth_model_1.PasswordResetToken.findOne({
        userId,
        token,
    });
    if (!validateTokenFromDB) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Token expired or invalid token!');
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.jwt_access_secret);
    if (decoded.userId !== userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token!');
    }
    // Retrieve the user from the database
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    // Check if the user is deleted or blocked
    if (user.isDeleted) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is deleted!');
    }
    if (user.status === 'blocked') {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked!');
    }
    // Hash the new password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.jwt.bcrypt_salt_rounds));
    console.log(hashedPassword);
    // updating the user's password
    yield user_model_1.User.findOneAndUpdate({
        _id: userId,
    }, {
        password: hashedPassword,
    });
    const deleteData = yield auth_model_1.PasswordResetToken.findOneAndDelete({
        userId,
        token,
    });
    console.log(deleteData);
    return null;
});
exports.AuthServices = {
    registerUser,
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword_otp_send,
    forgotPassword,
};
