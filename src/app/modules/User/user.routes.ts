import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import { UserController } from './user.controller';

const router = express.Router();

// get all users
router.get(
  '/get-me',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  UserController.getMeFromDb,
);

// get a single user
router.get(
  '/get-a-single-user/:userId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  UserController.getASingleUser,
);

// get all users
router.get(
  '/get-all-users',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  UserController.getAllUsersFromDB,
);

// update a user
router.put(
  '/update-a-user',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  //   validateRequest(WishlistValidation.WishlistAddAndUpdateValidationSchema),
  UserController.updateAUserInDB,
);

// update a wishlist
router.put(
  '/update-wishlist',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  //   validateRequest(WishlistValidation.WishlistAddAndUpdateValidationSchema),
  UserController.updateWishlistInDB,
);

// // delete a wishlist ( only admin can delete - softDelete )
// router.delete(
//   '/delete-single-wishlist/:id',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   WishlistControllers.deleteSingleWishlistFromDB,
// );

export const UserRoutes = router;
