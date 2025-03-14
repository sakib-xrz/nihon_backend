import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import { CustomizationControllers } from './customization.controller';

const router = express.Router();

// get all products
router.get(
  '/get-customization',
  CustomizationControllers.getCustomizationFromDB,
);

// update or add customization
router.put(
  '/add_update-customization',
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
  CustomizationControllers.addOrUpdateCustomizationInDB,
);

// update carousel
router.put(
  '/update-carousel',
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
  CustomizationControllers.updateCarouselInDB,
);

export const CustomizationRoutes = router;
