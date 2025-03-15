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
exports.OrderServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../User/user.model");
const order_model_1 = require("./order.model");
// get orders by user
const getAllOrdersByUserIDFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.isUserExistsByCustomId(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This user dose not exists !');
    }
    const orders = yield order_model_1.Order.find({ user: userId })
        .populate('user')
        .populate({
        path: 'products.product_id',
        populate: ['category', 'brand'],
    });
    // transforming data to the required structure
    const transformedOrders = orders.map((order) => ({
        order_id: order._id,
        user: {
            _id: order.user._id,
            name: order.user.name,
            gender: order.user.gender,
            email: order.user.email,
            role: order.user.role,
        },
        TXID: order.TXID,
        total_price: order.total_price,
        all_products: order.products.map((product) => ({
            _id: product.product_id._id,
            name: product.product_id.name,
            images: product.product_id.images,
            price: product.product_id.price,
            sku: product.product_id.sku,
            weight: product.product_id.weight,
            category: product.product_id.category,
            brand: product.product_id.brand,
            purchased_quantity: product.quantity,
        })),
        shipping_address: {
            firstName: order.shipping_address.firstName,
            lastName: order.shipping_address.lastName,
            emailOrPhone: order.shipping_address.emailOrPhone,
            mobileNumber: order.shipping_address.mobileNumber,
            address: order.shipping_address.address,
            city: order.shipping_address.city,
            state: order.shipping_address.state,
            zip_code: order.shipping_address.zip_code,
        },
        isDelivered: order.isDelivered,
        isShipped: order.isShipped,
        track_url: order.track_url,
        isCashOnDelivery: order.isCashOnDelivery,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        isDeleted: order.isDeleted,
        paymentDate: order.paymentDate,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }));
    return transformedOrders;
});
// get orders by user
const getAllOrdersFromDBForAdminPanel = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({ isDeleted: false })
        .populate('user')
        .populate({
        path: 'products.product_id',
        populate: ['category', 'brand'],
    });
    // transforming data to the required structure
    const transformedOrders = orders.map((order) => ({
        order_id: order._id,
        user: {
            _id: order.user._id,
            name: order.user.name,
            gender: order.user.gender,
            email: order.user.email,
            role: order.user.role,
        },
        TXID: order.TXID,
        total_price: order.total_price,
        all_products: order.products.map((product) => ({
            _id: product.product_id._id,
            name: product.product_id.name,
            images: product.product_id.images,
            price: product.product_id.price,
            sku: product.product_id.sku,
            weight: product.product_id.weight,
            category: product.product_id.category,
            brand: product.product_id.brand,
            purchased_quantity: product.quantity,
        })),
        shipping_address: {
            firstName: order.shipping_address.firstName,
            lastName: order.shipping_address.lastName,
            emailOrPhone: order.shipping_address.emailOrPhone,
            mobileNumber: order.shipping_address.mobileNumber,
            address: order.shipping_address.address,
            city: order.shipping_address.city,
            state: order.shipping_address.state,
            zip_code: order.shipping_address.zip_code,
        },
        isDelivered: order.isDelivered,
        isShipped: order.isShipped,
        track_url: order.track_url,
        isCashOnDelivery: order.isCashOnDelivery,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        isDeleted: order.isDeleted,
        paymentDate: order.paymentDate,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    }));
    return transformedOrders;
});
// update order
const updateAOrderInDB = (orderId, orderUpdates) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the order is exists
    const isOrderExists = yield order_model_1.Order.isOrderExistsByIdAndNotDeleted(orderId);
    if (!isOrderExists) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This order dose not exists!');
    }
    const order = yield order_model_1.Order.findByIdAndUpdate(orderId, orderUpdates, {
        new: true,
    });
    return order;
});
exports.OrderServices = {
    getAllOrdersByUserIDFromDB,
    getAllOrdersFromDBForAdminPanel,
    updateAOrderInDB,
};
