"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const brand_validation_1 = require("./brand.validation");
const brand_controller_1 = require("./brand.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
// get all brands
router.get('/get-all-brands', brand_controller_1.BrandControllers.getAllBrandsFromDB);
// single brand get
router.get('/get-single-brand/:id', brand_controller_1.BrandControllers.getSingleBrandFromDB);
// add a brand
router.post('/add-brand', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(brand_validation_1.BrandValidation.brandAddValidationSchema), brand_controller_1.BrandControllers.addBrandInDB);
// update a brand
router.put('/update-single-brand/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(brand_validation_1.BrandValidation.brandUpdateValidationSchema), brand_controller_1.BrandControllers.updateSingleBrandInDB);
// delete a brand ( only admin can delete - softDelete )
router.delete('/delete-single-brand/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), brand_controller_1.BrandControllers.deleteSingleBrandFromDB);
exports.BrandRoutes = router;
