import { Schema, model } from 'mongoose';
import { BrandModel, TBrand } from './brand.interface';

const BrandSchema = new Schema<TBrand, BrandModel>(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: false },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

BrandSchema.statics.isBrandExistsByIdAndNotDeleted = async function (
  id: string,
) {
  return await Brand.findOne({ _id: id, isDeleted: false });
};

export const Brand = model<TBrand, BrandModel>('Brand', BrandSchema);
