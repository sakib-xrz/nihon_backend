import { Schema, model } from 'mongoose';
import { OrderModel, OrderStatus, TOrder } from './order.interface';
import { PAYMENT_METHOD } from './order.constant';

// shipping_address schema
const ShippingAddressSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailOrPhone: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, required: true },
  },
  { _id: false },
);

// product sub-schema for individual products in the order
const ProductSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false },
);

// order schema
const OrderSchema = new Schema<TOrder, OrderModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    TXID: { type: String, required: false },
    total_price: { type: Number, required: true },
    products: [ProductSchema],
    shipping_address: { type: ShippingAddressSchema, required: true },
    isDelivered: { type: Boolean, default: false },
    isShipped: { type: Boolean, default: false },
    track_url: { type: String, default: '' },
    isCashOnDelivery: { type: Boolean, default: false },
    payment_method: {
      type: String,
      enum: [PAYMENT_METHOD.cash_on_delivery, PAYMENT_METHOD.online_payment],
      required: true,
    },
    paymentDate: { type: Date, default: Date.now },
    payment_status: {
      type: String,
      enum: Object.values(OrderStatus), // Use the enum values
      default: OrderStatus.Pending,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Static method to check if order exists by ID and is not deleted
OrderSchema.statics.isOrderExistsByIdAndNotDeleted = async function (
  id: string,
) {
  return await this.findOne({ _id: id, isDeleted: false });
};

export const Order = model<TOrder, OrderModel>('Order', OrderSchema);
