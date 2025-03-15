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
exports.OrderControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const AppError_1 = __importDefault(require("../../errors/AppError"));
// get orders by user
const getAllOrdersByUserIDFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield order_service_1.OrderServices.getAllOrdersByUserIDFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Orders fetched successfully!',
        data: result,
    });
}));
// get orders by user
const getAllOrdersFromDBForAdminPanel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // checking if the user has the required role
    if (['superAdmin', 'admin', 'moderator'].includes(user.role)) {
        const result = yield order_service_1.OrderServices.getAllOrdersFromDBForAdminPanel();
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: 'All Orders fetched successfully!',
            data: result,
        });
    }
    throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This user dose not have required permission to access this api !');
}));
// update order
const updateAOrderInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.orderId;
    const orderUpdates = req.body;
    const result = yield order_service_1.OrderServices.updateAOrderInDB(orderId, orderUpdates);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Order updated successfully!',
        data: result,
    });
}));
exports.OrderControllers = {
    getAllOrdersByUserIDFromDB,
    getAllOrdersFromDBForAdminPanel,
    updateAOrderInDB,
};
