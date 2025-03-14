import { z } from 'zod';

// defining Zod validation schema for subscriber
const subscriberValidationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const SubscriberValidation = {
  subscriberValidationSchema,
};
