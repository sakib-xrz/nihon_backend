import express, { json, NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BrandValidation } from './brand.validation';
import { BrandControllers } from './brand.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

// get all brands
router.get('/get-all-brands', BrandControllers.getAllBrandsFromDB);

// single brand get
router.get('/get-single-brand/:id', BrandControllers.getSingleBrandFromDB);

// add a brand
router.post(
  '/add-brand',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(BrandValidation.brandAddValidationSchema),
  BrandControllers.addBrandInDB,
);

// update a brand
router.put(
  '/update-single-brand/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(BrandValidation.brandUpdateValidationSchema),
  BrandControllers.updateSingleBrandInDB,
);

// delete a brand ( only admin can delete - softDelete )
router.delete(
  '/delete-single-brand/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  BrandControllers.deleteSingleBrandFromDB,
);

export const BrandRoutes = router;
