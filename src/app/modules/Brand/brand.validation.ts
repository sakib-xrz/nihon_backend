import { z } from 'zod';

// Define the validation schema for the brand add request
const brandAddValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    desc: z.string(),
  }),
});
// Define the validation schema for the brand update request
const brandUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
  }),
});

export const BrandValidation = {
  brandAddValidationSchema,
  brandUpdateValidationSchema,
};
