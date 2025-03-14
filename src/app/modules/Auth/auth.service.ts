import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendEmail } from '../../utils/sendEmail';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import { createToken, verifyToken } from './auth.utils';
import { TUser } from '../User/user.interface';
import { USER_STATUS } from '../User/user.constant';
import { htmlTemplate } from './auth.email_template';
import { PasswordResetToken } from './auth.model';

// register new user
const registerUser = async (payload: TUser) => {
  // checking if the user exists
  const isEmailExists = await User.isUserExistsByEmail(payload.email);
  // if exists throwing error
  if (isEmailExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user already exists !');
  }
  // creating the user
  const result = await User.create(payload);
  // removing password from response
  const userObject = result.toObject();
  delete userObject.password;
  // returning obj
  return userObject;
};

// login user
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload.email);
  // if user not exists then throwing error
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct

  const isPasswordMatched = await User.isPasswordMatched(
    payload?.password,
    user?.password as string,
  );

  console.log(isPasswordMatched);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  //create token and sent to the  client

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt.jwt_refresh_secret as string,
    config.jwt.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

// refresh token revalidate to generate new access token
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt.jwt_refresh_secret as string);

  const { userId } = decoded;
  //github.com/dev-niloy/nihon-beauty-backend-server
  // checking if the user is exist

  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    config.jwt.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

// change password
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked

  const userStatus = user?.status;

  if (userStatus === USER_STATUS.blocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  //checking if the password is correct
  const isPasswordMatched = await User.isPasswordMatched(
    payload.oldPassword,
    user?.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.jwt.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
    },
  );

  return null;
};

// forget password otp send
const forgetPassword_otp_send = async (userEmail: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt.jwt_access_secret as string,
    '10m',
  );

  // here create a system if the link is use one to reset password the token will be invalidate

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;

  // creating a record for the token in the database
  await PasswordResetToken.create({
    userId: user.id,
    token: resetToken,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const emailContent = htmlTemplate(resetUILink);
  await sendEmail(user.email, emailContent);
};

// forgot password
const forgotPassword = async (
  userId: string,
  token: string,
  newPassword: string,
) => {
  const validateTokenFromDB = await PasswordResetToken.findOne({
    userId,
    token,
  });

  if (!validateTokenFromDB) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Token expired or invalid token!',
    );
  }

  const decoded = jwt.verify(token, config.jwt.jwt_access_secret as string) as {
    userId: string;
    role: string;
  };

  if (decoded.userId !== userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
  }

  // Retrieve the user from the database
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Check if the user is deleted or blocked
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  // Hash the new password

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.bcrypt_salt_rounds),
  );

  console.log(hashedPassword);

  // updating the user's password
  await User.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      password: hashedPassword,
    },
  );

  const deleteData = await PasswordResetToken.findOneAndDelete({
    userId,
    token,
  });
  console.log(deleteData);

  return null;
};

export const AuthServices = {
  registerUser,
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword_otp_send,
  forgotPassword,
};
