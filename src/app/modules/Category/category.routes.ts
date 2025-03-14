import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { CategoryControllers } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

// get all category
router.get('/get-all-categories', CategoryControllers.getAllCategoriesFromDB);

// single category get
router.get(
  '/get-single-category/:id',
  CategoryControllers.getSingleCategoryFromDB,
);

// add a category
router.post(
  '/add-category',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CategoryValidation.categoryAddValidationSchema),
  CategoryControllers.addCategoryInDB,
);

// update a category
router.put(
  '/update-single-category/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(CategoryValidation.categoryUpdateValidationSchema),
  CategoryControllers.updateSingleCategoryInDB,
);

// delete a category ( only admin can delete - softDelete )
router.delete(
  '/delete-single-category/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryControllers.deleteSingleCategoryFromDB,
);

export const CategoryRoutes = router;
