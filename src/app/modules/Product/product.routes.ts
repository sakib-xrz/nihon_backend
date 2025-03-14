import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductValidation } from './product.validation';
import { ProductControllers } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

// get all products
router.get('/get-all-products', ProductControllers.getAllProductsFromDB);

// single product get
router.get(
  '/get-single-product/:id',
  ProductControllers.getSingleProductFromDB,
);

// add a product
router.post(
  '/add-product',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.array('files', 3),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ProductValidation.productAddValidationSchema),
  ProductControllers.addProductInDB,
);

// update product images
router.patch(
  '/update-product-images/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  upload.array('files', 3),
  ProductControllers.updateProductImagesInDB,
);

// update product details
router.patch(
  '/update-product-details/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(ProductValidation.productUpdateValidationSchema),
  ProductControllers.updateProductDetailsInDB,
);

// delete a product ( only admin can delete - softDelete )
router.delete(
  '/delete-single-product/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  ProductControllers.deleteSingleProductFromDB,
);

// delete product image
router.delete(
  '/delete-product-image/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  ProductControllers.deleteProductImage,
);

// change product on market status
router.patch(
  '/update-product-on-market/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  ProductControllers.updateProductOnMarketStatus,
);

export const ProductRoutes = router;
