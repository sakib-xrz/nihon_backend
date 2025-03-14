import { z } from 'zod';

// Define the validation schema for the category add request
const categoryAddValidationSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});
// Define the validation schema for the category update request
const categoryUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export const CategoryValidation = {
  categoryAddValidationSchema,
  categoryUpdateValidationSchema,
};
