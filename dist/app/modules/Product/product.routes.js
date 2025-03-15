"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = require("./product.validation");
const product_controller_1 = require("./product.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../User/user.constant");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
// get all products
router.get('/get-all-products', product_controller_1.ProductControllers.getAllProductsFromDB);
// single product get
router.get('/get-single-product/:id', product_controller_1.ProductControllers.getSingleProductFromDB);
// add a product
router.post('/add-product', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), sendImageToCloudinary_1.upload.array('files', 3), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(product_validation_1.ProductValidation.productAddValidationSchema), product_controller_1.ProductControllers.addProductInDB);
// update product images
router.patch('/update-product-images/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), sendImageToCloudinary_1.upload.array('files', 3), product_controller_1.ProductControllers.updateProductImagesInDB);
// update product details
router.patch('/update-product-details/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(product_validation_1.ProductValidation.productUpdateValidationSchema), product_controller_1.ProductControllers.updateProductDetailsInDB);
// delete a product ( only admin can delete - softDelete )
router.delete('/delete-single-product/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), product_controller_1.ProductControllers.deleteSingleProductFromDB);
// delete product image
router.delete('/delete-product-image/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), product_controller_1.ProductControllers.deleteProductImage);
// change product on market status
router.patch('/update-product-on-market/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), product_controller_1.ProductControllers.updateProductOnMarketStatus);
exports.ProductRoutes = router;
