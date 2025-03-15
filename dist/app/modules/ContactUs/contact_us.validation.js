"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactUsValidation = void 0;
const zod_1 = require("zod");
const contactUsValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    subject: zod_1.z.string().min(1, 'Subject is required'),
    message: zod_1.z.string().min(1, 'Message is required'),
});
exports.ContactUsValidation = {
    contactUsValidationSchema,
};
