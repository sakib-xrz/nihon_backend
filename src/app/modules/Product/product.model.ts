import { Schema, model, Types } from 'mongoose';
import { ProductModel, TProduct } from './product.interface';

// Define the Product Schema
const productSchema = new Schema<TProduct, ProductModel>(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    images: [{ type: String, required: false }],
    price: { type: Number, required: true },
    in_stock: { type: Number, required: true },
    weight: { type: Number, required: false },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: false },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review', default: [] }],
    averageRating: { type: Number, required: false, default: 0 },
    isOnMarketStatus: {
      type: String,
      enum: ['onMarket', 'pre-order'],
      required: true,
      default: 'onMarket',
    },
    // discount system
    discount: {
      value: { type: Number, required: false, default: 0 },
      type: {
        type: String,
        enum: ['percentage', 'flat'],
        required: false,
        default: 'percentage',
      },
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
    },

    isPublished: { type: Boolean, required: true, default: false },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }, // Include virtuals in Object output
  },
);

// Add virtual for discounted price
productSchema.virtual('discountedPrice').get(function () {
  const discount = this.discount;

  if (discount && discount.value > 0) {
    if (discount.type === 'percentage') {
      return this.price - (this.price * discount.value) / 100;
    }
    if (discount.type === 'flat') {
      return Math.max(this.price - discount.value, 0); // Ensure price doesn't go below 0
    }
  }
  return this.price; // No discount applied
});

// Static method to check if product exists by ID and is not deleted
productSchema.statics.isProductExistsByIdAndNotDeleted = async function (
  id: string | Types.ObjectId,
) {
  return await this.findOne({ _id: id, isDeleted: false })
    .populate('category')
    .populate('brand')
    .populate('reviews');
};

export const Product = model<TProduct, ProductModel>('Product', productSchema);
