import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

// register a user
router.post(
  '/register-user',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthControllers.registerUser,
);

// login a user
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

// refresh token revalidate to generate new access token
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// change password
router.post(
  '/change-password',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

// forget password otp send
router.post(
  '/forget-password_otp-send',
  validateRequest(AuthValidation.forgetPasswordSendOtpValidationSchema),
  AuthControllers.forgetPassword_otp_send,
);

// forget password
router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgotPassword,
);

export const AuthRoutes = router;
