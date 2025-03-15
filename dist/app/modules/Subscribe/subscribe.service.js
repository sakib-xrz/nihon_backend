"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const subscribe_model_1 = require("./subscribe.model");
// subscribe to news letter notifications
const subscribeToNewsLetter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // find the email if it is already subscribed
    const isEmailExistsInSubscribeDB = yield subscribe_model_1.Subscriber.findOne({ email });
    if (isEmailExistsInSubscribeDB) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email already subscribed');
    }
    // create a new subscriber record
    const newSubscriber = new subscribe_model_1.Subscriber({ email });
    yield newSubscriber.save();
});
exports.SubscribeServices = { subscribeToNewsLetter };
