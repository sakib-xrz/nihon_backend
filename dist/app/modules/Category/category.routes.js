"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const category_validation_1 = require("./category.validation");
const category_controller_1 = require("./category.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
// get all category
router.get('/get-all-categories', category_controller_1.CategoryControllers.getAllCategoriesFromDB);
// single category get
router.get('/get-single-category/:id', category_controller_1.CategoryControllers.getSingleCategoryFromDB);
// add a category
router.post('/add-category', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(category_validation_1.CategoryValidation.categoryAddValidationSchema), category_controller_1.CategoryControllers.addCategoryInDB);
// update a category
router.put('/update-single-category/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(category_validation_1.CategoryValidation.categoryUpdateValidationSchema), category_controller_1.CategoryControllers.updateSingleCategoryInDB);
// delete a category ( only admin can delete - softDelete )
router.delete('/delete-single-category/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), category_controller_1.CategoryControllers.deleteSingleCategoryFromDB);
exports.CategoryRoutes = router;
