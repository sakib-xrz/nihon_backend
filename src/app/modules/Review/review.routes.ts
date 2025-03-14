import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { ReviewControllers } from './review.controller';

const router = express.Router();

// add a product review
router.post(
  '/add-product-review/:productId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  // validateRequest(ProductValidation.productAddValidationSchema),
  ReviewControllers.addProductReviewAndRatingInDB,
);

// delete a product review from db
router.delete(
  '/remove-product-review/:reviewId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  // validateRequest(ProductValidation.productAddValidationSchema),
  ReviewControllers.deleteASingleProductReviewInDB,
);
export const ReviewRoutes = router;
