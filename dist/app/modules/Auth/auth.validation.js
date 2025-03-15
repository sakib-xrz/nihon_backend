"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
// Define the validation schema for the register API
const registerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        gender: zod_1.z.enum(['male', 'female', 'other']),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        image: zod_1.z.string().url().optional(),
        role: zod_1.z.enum(['superAdmin', 'admin', 'moderator', 'user']).default('user'),
        status: zod_1.z.enum(['active', 'blocked']).default('active'),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required.' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string({
            required_error: 'Old password is required',
        }),
        newPassword: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    cookies: zod_1.z.object({
        refreshToken: zod_1.z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string({
            required_error: 'User id is required!',
        }),
        newPassword: zod_1.z.string({
            required_error: 'User password is required!',
        }),
    }),
});
const forgetPasswordSendOtpValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({
            required_error: 'User email is required!',
        }),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: 'User id is required!',
        }),
        token: zod_1.z.string({
            required_error: 'Token id is required!',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New password id is required!',
        }),
    }),
});
exports.AuthValidation = {
    registerValidationSchema,
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordSendOtpValidationSchema,
    resetPasswordValidationSchema,
    forgetPasswordValidationSchema,
};
