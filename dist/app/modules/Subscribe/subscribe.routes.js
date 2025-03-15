"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subscribe_controller_1 = require("./subscribe.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const subscribe_validation_1 = require("./subscribe.validation");
const router = express_1.default.Router();
// subscribe to news letter notifications
router.post('/subscribe_to_news-letter/:email', (0, validateRequest_1.default)(subscribe_validation_1.SubscriberValidation.subscriberValidationSchema), subscribe_controller_1.SubscribeControllers.subscribeToNewsLetter);
exports.SubscribeRoutes = router;
