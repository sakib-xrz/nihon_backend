import { z } from 'zod';

const contactUsValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export const ContactUsValidation = {
  contactUsValidationSchema,
};
