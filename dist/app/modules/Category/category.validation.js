"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryValidation = void 0;
const zod_1 = require("zod");
// Define the validation schema for the category add request
const categoryAddValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
    }),
});
// Define the validation schema for the category update request
const categoryUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
    }),
});
exports.CategoryValidation = {
    categoryAddValidationSchema,
    categoryUpdateValidationSchema,
};
