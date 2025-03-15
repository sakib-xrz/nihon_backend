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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const order_constant_1 = require("./order.constant");
// shipping_address schema
const ShippingAddressSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailOrPhone: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
}, { _id: false });
// product sub-schema for individual products in the order
const ProductSchema = new mongoose_1.Schema({
    product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
}, { _id: false });
// order schema
const OrderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    TXID: { type: String, required: false },
    total_price: { type: Number, required: true },
    products: [ProductSchema],
    shipping_address: { type: ShippingAddressSchema, required: true },
    isDelivered: { type: Boolean, default: false },
    isShipped: { type: Boolean, default: false },
    track_url: { type: String, default: '' },
    isCashOnDelivery: { type: Boolean, default: false },
    payment_method: {
        type: String,
        enum: [order_constant_1.PAYMENT_METHOD.cash_on_delivery, order_constant_1.PAYMENT_METHOD.online_payment],
        required: true,
    },
    paymentDate: { type: Date, default: Date.now },
    payment_status: {
        type: String,
        enum: Object.values(order_interface_1.OrderStatus), // Use the enum values
        default: order_interface_1.OrderStatus.Pending,
    },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// Static method to check if order exists by ID and is not deleted
OrderSchema.statics.isOrderExistsByIdAndNotDeleted = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ _id: id, isDeleted: false });
    });
};
exports.Order = (0, mongoose_1.model)('Order', OrderSchema);
