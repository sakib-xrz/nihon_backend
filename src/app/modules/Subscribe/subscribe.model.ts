import mongoose, { Schema } from 'mongoose';
import { ISubscriber } from './subscribe.interface';

// review schema
const subscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
});
export const Subscriber = mongoose.model<ISubscriber>(
  'Subscriber',
  subscriberSchema,
);
