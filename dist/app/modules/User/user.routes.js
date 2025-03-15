"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
// get all users
router.get('/get-me', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator, user_constant_1.USER_ROLE.user), user_controller_1.UserController.getMeFromDb);
// get a single user
router.get('/get-a-single-user/:userId', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator, user_constant_1.USER_ROLE.user), user_controller_1.UserController.getASingleUser);
// get all users
router.get('/get-all-users', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), user_controller_1.UserController.getAllUsersFromDB);
// update a user
router.put('/update-a-user', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator, user_constant_1.USER_ROLE.user), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, 
//   validateRequest(WishlistValidation.WishlistAddAndUpdateValidationSchema),
user_controller_1.UserController.updateAUserInDB);
// update a wishlist
router.put('/update-wishlist', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator, user_constant_1.USER_ROLE.user), 
//   validateRequest(WishlistValidation.WishlistAddAndUpdateValidationSchema),
user_controller_1.UserController.updateWishlistInDB);
// // delete a wishlist ( only admin can delete - softDelete )
// router.delete(
//   '/delete-single-wishlist/:id',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   WishlistControllers.deleteSingleWishlistFromDB,
// );
exports.UserRoutes = router;
