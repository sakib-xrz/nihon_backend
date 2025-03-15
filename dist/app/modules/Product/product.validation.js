"use strict";
// import { Types } from 'mongoose';
// import { z } from 'zod';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
// // Define the validation schema for the product add request
// const productAddValidationSchema = z.object({
//   body: z.object({
//     name: z.string(),
//     desc: z.string(),
//     price: z.number().positive(),
//     in_stock: z.number().nonnegative(),
//     weight: z.number().nonnegative().optional(),
//     category_id: z
//       .string()
//       .refine((val) => Types.ObjectId.isValid(val), {
//         message: 'Invalid ObjectId',
//       })
//       .optional(),
//     review_id: z.string().optional(),
//     brand_id: z
//       .string()
//       .refine((val) => Types.ObjectId.isValid(val), {
//         message: 'Invalid ObjectId',
//       })
//       .optional(),
//   }),
// });
// // Define the validation schema for the product update request
// const productUpdateValidationSchema = z.object({
//   body: z.object({
//     name: z.string().optional(),
//     desc: z.string().optional(),
//     price: z.number().positive().optional(),
//     in_stock: z.number().nonnegative().optional(),
//     weight: z.number().nonnegative().optional(),
//     category: z
//       .string()
//       .refine((val) => Types.ObjectId.isValid(val), {
//         message: 'Invalid ObjectId',
//       })
//       .optional(),
//     brand: z
//       .string()
//       .refine((val) => Types.ObjectId.isValid(val), {
//         message: 'Invalid ObjectId',
//       })
//       .optional(),
//     imageIndexToUpdate: z.number().int().optional(),
//     review: z.string().optional(),
//   }),
// });
// export const ProductValidation = {
//   productAddValidationSchema,
//   productUpdateValidationSchema,
// };
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
// Define the validation schema for the discount field
const discountValidationSchema = zod_1.z
    .object({
    value: zod_1.z.number().nonnegative().optional(), // Discount value must be non-negative
    type: zod_1.z.enum(['percentage', 'flat']).optional(), // Discount type
    startDate: zod_1.z.string().datetime({ offset: true }).optional(), // Start date must be a valid ISO 8601 date
    endDate: zod_1.z.string().datetime({ offset: true }).optional(), // End date must be a valid ISO 8601 date
})
    .optional(); // The entire discount field is optional
// Define the validation schema for the product add request
const productAddValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        desc: zod_1.z.string(),
        price: zod_1.z.number().positive(),
        in_stock: zod_1.z.number().nonnegative(),
        weight: zod_1.z.number().nonnegative().optional(),
        category_id: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: 'Invalid ObjectId',
        })
            .optional(),
        brand_id: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: 'Invalid ObjectId',
        })
            .optional(),
        review_id: zod_1.z.string().optional(),
        discount: discountValidationSchema, // Add discount validation
    }),
});
// Define the validation schema for the product update request
const productUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        desc: zod_1.z.string().optional(),
        price: zod_1.z.number().positive().optional(),
        in_stock: zod_1.z.number().nonnegative().optional(),
        weight: zod_1.z.number().nonnegative().optional(),
        category: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: 'Invalid ObjectId',
        })
            .optional(),
        brand: zod_1.z
            .string()
            .refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
            message: 'Invalid ObjectId',
        })
            .optional(),
        imageIndexToUpdate: zod_1.z.number().int().optional(),
        review: zod_1.z.string().optional(),
        discount: discountValidationSchema,
    }),
});
exports.ProductValidation = {
    productAddValidationSchema,
    productUpdateValidationSchema,
};
