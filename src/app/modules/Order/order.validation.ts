import { z } from 'zod';
import { PAYMENT_METHOD } from './order.constant';

// Define the validation schema for the wishlist add request
const paymentAddValidationSchema = z.object({
  body: z.object({
    TXID: z.string({ required_error: 'TXID is required' }),
    total_price: z.number().min(0, 'Total price must be a positive number'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    products: z
      .array(z.string({ required_error: 'Product ID is required' }))
      .nonempty('At least one product is required'),
    billing_address: z.string({
      required_error: 'Billing address is required',
    }),
    isDelivered: z.boolean().default(false),
    isShipped: z.boolean().default(false),
    track_url: z.string().optional().default(''),
    isCashOnDelivery: z.boolean().default(false),
    payment_method: z.enum([
      PAYMENT_METHOD.cash_on_delivery,
      PAYMENT_METHOD.cash_on_delivery,
    ]),
  }),
});
// Define the validation schema for the category update request
const paymentUpdateValidationSchema = z.object({
  body: z.object({
    total_price: z
      .number()
      .min(0, 'Total price must be a positive number')
      .optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
    billing_address: z
      .string({
        required_error: 'Billing address is required',
      })
      .optional(),
    isDelivered: z.boolean().default(false).optional(),
    isShipped: z.boolean().default(false).optional(),
    track_url: z.string().optional().default('').optional(),
    isCashOnDelivery: z.boolean().default(false).optional(),
    payment_method: z
      .enum([PAYMENT_METHOD.cash_on_delivery, PAYMENT_METHOD.cash_on_delivery])
      .optional(),
  }),
});

export const PaymentValidation = {
  paymentAddValidationSchema,
  paymentUpdateValidationSchema,
};
