"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidation = void 0;
const zod_1 = require("zod");
// Define the validation schema for the brand add request
const brandAddValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        desc: zod_1.z.string(),
    }),
});
// Define the validation schema for the brand update request
const brandUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        desc: zod_1.z.string().optional(),
    }),
});
exports.BrandValidation = {
    brandAddValidationSchema,
    brandUpdateValidationSchema,
};
