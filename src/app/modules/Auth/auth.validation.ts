import { z } from 'zod';

// Define the validation schema for the register API
const registerValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    email: z.string().email(),
    password: z.string().min(6),
    image: z.string().url().optional(),
    role: z.enum(['superAdmin', 'admin', 'moderator', 'user']).default('user'),
    status: z.enum(['active', 'blocked']).default('active'),
    isDeleted: z.boolean().default(false),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required.' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

const forgetPasswordSendOtpValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User email is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'User id is required!',
    }),
    token: z.string({
      required_error: 'Token id is required!',
    }),
    newPassword: z.string({
      required_error: 'New password id is required!',
    }),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordSendOtpValidationSchema,
  resetPasswordValidationSchema,
  forgetPasswordValidationSchema,
};
