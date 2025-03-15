"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const order_constant_1 = require("./order.constant");
// Define the validation schema for the wishlist add request
const paymentAddValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        TXID: zod_1.z.string({ required_error: 'TXID is required' }),
        total_price: zod_1.z.number().min(0, 'Total price must be a positive number'),
        quantity: zod_1.z.number().min(1, 'Quantity must be at least 1'),
        products: zod_1.z
            .array(zod_1.z.string({ required_error: 'Product ID is required' }))
            .nonempty('At least one product is required'),
        billing_address: zod_1.z.string({
            required_error: 'Billing address is required',
        }),
        isDelivered: zod_1.z.boolean().default(false),
        isShipped: zod_1.z.boolean().default(false),
        track_url: zod_1.z.string().optional().default(''),
        isCashOnDelivery: zod_1.z.boolean().default(false),
        payment_method: zod_1.z.enum([
            order_constant_1.PAYMENT_METHOD.cash_on_delivery,
            order_constant_1.PAYMENT_METHOD.cash_on_delivery,
        ]),
    }),
});
// Define the validation schema for the category update request
const paymentUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        total_price: zod_1.z
            .number()
            .min(0, 'Total price must be a positive number')
            .optional(),
        quantity: zod_1.z.number().min(1, 'Quantity must be at least 1').optional(),
        billing_address: zod_1.z
            .string({
            required_error: 'Billing address is required',
        })
            .optional(),
        isDelivered: zod_1.z.boolean().default(false).optional(),
        isShipped: zod_1.z.boolean().default(false).optional(),
        track_url: zod_1.z.string().optional().default('').optional(),
        isCashOnDelivery: zod_1.z.boolean().default(false).optional(),
        payment_method: zod_1.z
            .enum([order_constant_1.PAYMENT_METHOD.cash_on_delivery, order_constant_1.PAYMENT_METHOD.cash_on_delivery])
            .optional(),
    }),
});
exports.PaymentValidation = {
    paymentAddValidationSchema,
    paymentUpdateValidationSchema,
};
