import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import { OrderControllers } from './order.controller';

const router = express.Router();

// add a payment
router.get(
  '/get-orders',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.moderator,
    USER_ROLE.user,
  ),
  OrderControllers.getAllOrdersByUserIDFromDB,
);

// add a payment
router.get(
  '/get-all-orders_admin-panel',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  OrderControllers.getAllOrdersFromDBForAdminPanel,
);

// update a single order
router.patch(
  '/update-single-order/:orderId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  OrderControllers.updateAOrderInDB,
);

export const OrderRoutes = router;
