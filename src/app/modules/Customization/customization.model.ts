import { Schema, model } from 'mongoose';
import { TCustomization } from './customization.interface';

// customization Schema
const CustomizationSchema = new Schema<TCustomization>(
  {
    logo: { type: String },
    banner_1: { type: String },
    banner_2: { type: String },
    banner_3: { type: String },
    banner_4: { type: String },
    carousel: [
      {
        img: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

export const Customization = model<TCustomization>(
  'Customization',
  CustomizationSchema,
);
