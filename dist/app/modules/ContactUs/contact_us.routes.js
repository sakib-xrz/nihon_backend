"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const contact_us_controller_1 = require("./contact_us.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contact_us_validation_1 = require("./contact_us.validation");
const user_constant_1 = require("../User/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// contact us
router.post('/contact_us', (0, validateRequest_1.default)(contact_us_validation_1.ContactUsValidation.contactUsValidationSchema), contact_us_controller_1.ContactUsControllers.addContactUsDataToDB);
// update contact us status
router.put('/update_contact_us_status/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.moderator), contact_us_controller_1.ContactUsControllers.updateContactUsStatus);
exports.ContactUsRoutes = router;
