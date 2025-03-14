import { z } from 'zod';

const Chat_Payment_ZodValidation = z.object({
  body: z.object({
    user_id: z.string(),
    adviser_id: z.string(),
    payment_method: z.string(),
    transaction_id: z.string(),
    payment_amount: z.number(),
    total_chat_count: z.number(),
  }),
});

export const PaymentZodValidation = {
  Chat_Payment_ZodValidation,
};
