import { z } from 'zod';

// Define the validation schema for the category add request
const addAndUpdateAddressValidationSchema = z.object({
  body: z.object({
    present_address: z.string().optional(),
    billing_address: z.string().optional(),
  }),
});

export const AddressValidation = {
  addAndUpdateAddressValidationSchema,
};
