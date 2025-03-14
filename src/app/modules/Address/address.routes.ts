import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import { AddressValidation } from './address.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

// single address get
router.get(
  '/get-single-address/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  // AddressControllers.getSingleAddressFromDB,
);

// add a address
router.post(
  '/add-address',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AddressValidation.addAndUpdateAddressValidationSchema),
  // AddressControllers.addAddressInDB,
);

// update a address
router.put(
  '/update-single-address/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AddressValidation.addAndUpdateAddressValidationSchema),
  // AddressControllers.updateSingleAddressInDB,
);

// delete a address ( only admin can delete - softDelete )
router.delete(
  '/delete-single-address/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  // AddressControllers.deleteDeleteCategoryFromDB,
);

export const AddressRoutes = router;
