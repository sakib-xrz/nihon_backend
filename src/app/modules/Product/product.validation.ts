// import { Types } from 'mongoose';
// import { z } from 'zod';

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

import { Types } from 'mongoose';
import { z } from 'zod';

// Define the validation schema for the discount field
const discountValidationSchema = z
  .object({
    value: z.number().nonnegative().optional(), // Discount value must be non-negative
    type: z.enum(['percentage', 'flat']).optional(), // Discount type
    startDate: z.string().datetime({ offset: true }).optional(), // Start date must be a valid ISO 8601 date
    endDate: z.string().datetime({ offset: true }).optional(), // End date must be a valid ISO 8601 date
  })
  .optional(); // The entire discount field is optional

// Define the validation schema for the product add request
const productAddValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    desc: z.string(),
    price: z.number().positive(),
    in_stock: z.number().nonnegative(),
    weight: z.number().nonnegative().optional(),
    category_id: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .optional(),
    brand_id: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .optional(),
    review_id: z.string().optional(),
    discount: discountValidationSchema, // Add discount validation
  }),
});

// Define the validation schema for the product update request
const productUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    price: z.number().positive().optional(),
    in_stock: z.number().nonnegative().optional(),
    weight: z.number().nonnegative().optional(),
    category: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .optional(),
    brand: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
      })
      .optional(),
    imageIndexToUpdate: z.number().int().optional(),
    review: z.string().optional(),
    discount: discountValidationSchema,
  }),
});

export const ProductValidation = {
  productAddValidationSchema,
  productUpdateValidationSchema,
};
