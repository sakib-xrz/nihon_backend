import { Schema, model } from 'mongoose';
import { CategoryModel, TCategory } from './category.interface';

const CategorySchema = new Schema<TCategory, CategoryModel>(
  {
    name: { type: String, required: true },
    image: { type: String, required: false },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

CategorySchema.statics.isCategoryExistsByIdAndNotDeleted = async function (
  id: string,
) {
  return await Category.findOne({ _id: id, isDeleted: false });
};

export const Category = model<TCategory, CategoryModel>(
  'Category',
  CategorySchema,
);
