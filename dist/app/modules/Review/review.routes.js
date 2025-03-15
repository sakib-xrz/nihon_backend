"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
// add a product review
router.post('/add-product-review/:productId', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator, user_constant_1.USER_ROLE.user), 
// validateRequest(ProductValidation.productAddValidationSchema),
review_controller_1.ReviewControllers.addProductReviewAndRatingInDB);
// delete a product review from db
router.delete('/remove-product-review/:reviewId', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator, user_constant_1.USER_ROLE.user), 
// validateRequest(ProductValidation.productAddValidationSchema),
review_controller_1.ReviewControllers.deleteASingleProductReviewInDB);
exports.ReviewRoutes = router;
