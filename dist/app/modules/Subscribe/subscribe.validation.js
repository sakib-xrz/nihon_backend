"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriberValidation = void 0;
const zod_1 = require("zod");
// defining Zod validation schema for subscriber
const subscriberValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
});
exports.SubscriberValidation = {
    subscriberValidationSchema,
};
