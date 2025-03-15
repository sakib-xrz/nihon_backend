"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentZodValidation = void 0;
const zod_1 = require("zod");
const Chat_Payment_ZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        user_id: zod_1.z.string(),
        adviser_id: zod_1.z.string(),
        payment_method: zod_1.z.string(),
        transaction_id: zod_1.z.string(),
        payment_amount: zod_1.z.number(),
        total_chat_count: zod_1.z.number(),
    }),
});
exports.PaymentZodValidation = {
    Chat_Payment_ZodValidation,
};
