"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
// add a payment
router.get('/get-orders', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator, user_constant_1.USER_ROLE.user), order_controller_1.OrderControllers.getAllOrdersByUserIDFromDB);
// add a payment
router.get('/get-all-orders_admin-panel', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), order_controller_1.OrderControllers.getAllOrdersFromDBForAdminPanel);
// update a single order
router.patch('/update-single-order/:orderId', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), order_controller_1.OrderControllers.updateAOrderInDB);
exports.OrderRoutes = router;
