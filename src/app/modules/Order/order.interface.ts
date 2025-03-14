/* eslint-disable no-unused-vars */
import { Model, ObjectId, Types } from 'mongoose';
import { TPaymentMethod } from './order.constant';

export enum OrderStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

export const PAYMENT_METHOD = {
  cash_on_delivery: 'Cash On Delivery',
  online_payment: 'Online Payment',
};

export type TProduct = {
  product_id: Types.ObjectId;
  quantity: number;
};

export type TShippingAddress = {
  firstName: string;
  lastName: string;
  emailOrPhone: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
};

export type TOrder = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  TXID?: string;
  total_price: number;
  quantity: number;
  products: TProduct[];
  shipping_address: TShippingAddress;
  isDelivered: boolean;
  isShipped: boolean;
  track_url: string;
  isCashOnDelivery: boolean;
  payment_method: TPaymentMethod;
  paymentDate: Date;
  payment_status: OrderStatus;
  isDeleted: boolean;
};

export interface OrderModel extends Model<TOrder> {
  // Static method for checking if the order exists and is not deleted
  isOrderExistsByIdAndNotDeleted(
    id: Types.ObjectId | string,
  ): Promise<TOrder | null>;
}
