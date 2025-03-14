import { model, Schema } from 'mongoose';
import { IContact } from './contact_us.interface';

// Define Mongoose schema for Contact
const contactUsSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  is_contacted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Contact_Us = model<IContact>('Contact_Us', contactUsSchema);
