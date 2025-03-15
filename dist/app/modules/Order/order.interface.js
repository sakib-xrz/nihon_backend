"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_METHOD = exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "Pending";
    OrderStatus["Completed"] = "Completed";
    OrderStatus["Failed"] = "Failed";
    OrderStatus["Refunded"] = "Refunded";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
exports.PAYMENT_METHOD = {
    cash_on_delivery: 'Cash On Delivery',
    online_payment: 'Online Payment',
};
