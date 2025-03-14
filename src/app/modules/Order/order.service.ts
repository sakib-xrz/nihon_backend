/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { Order } from './order.model';

// get orders by user
const getAllOrdersByUserIDFromDB = async (userId: string) => {
  const isUserExists = await User.isUserExistsByCustomId(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user dose not exists !');
  }

  const orders = await Order.find({ user: userId })
    .populate('user')
    .populate({
      path: 'products.product_id',
      populate: ['category', 'brand'],
    });

  // transforming data to the required structure
  const transformedOrders = orders.map((order: any) => ({
    order_id: order._id,
    user: {
      _id: order.user._id,
      name: order.user.name,
      gender: order.user.gender,
      email: order.user.email,
      role: order.user.role,
    },
    TXID: order.TXID,
    total_price: order.total_price,
    all_products: order.products.map((product: any) => ({
      _id: product.product_id._id,
      name: product.product_id.name,
      images: product.product_id.images,
      price: product.product_id.price,
      sku: product.product_id.sku,
      weight: product.product_id.weight,
      category: product.product_id.category,
      brand: product.product_id.brand,
      purchased_quantity: product.quantity,
    })),
    shipping_address: {
      firstName: order.shipping_address.firstName,
      lastName: order.shipping_address.lastName,
      emailOrPhone: order.shipping_address.emailOrPhone,
      mobileNumber: order.shipping_address.mobileNumber,
      address: order.shipping_address.address,
      city: order.shipping_address.city,
      state: order.shipping_address.state,
      zip_code: order.shipping_address.zip_code,
    },
    isDelivered: order.isDelivered,
    isShipped: order.isShipped,
    track_url: order.track_url,
    isCashOnDelivery: order.isCashOnDelivery,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    isDeleted: order.isDeleted,
    paymentDate: order.paymentDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
  return transformedOrders;
};

// get orders by user
const getAllOrdersFromDBForAdminPanel = async () => {
  const orders = await Order.find({ isDeleted: false })
    .populate('user')
    .populate({
      path: 'products.product_id',
      populate: ['category', 'brand'],
    });

  // transforming data to the required structure
  const transformedOrders = orders.map((order: any) => ({
    order_id: order._id,
    user: {
      _id: order.user._id,
      name: order.user.name,
      gender: order.user.gender,
      email: order.user.email,
      role: order.user.role,
    },
    TXID: order.TXID,
    total_price: order.total_price,
    all_products: order.products.map((product: any) => ({
      _id: product.product_id._id,
      name: product.product_id.name,
      images: product.product_id.images,
      price: product.product_id.price,
      sku: product.product_id.sku,
      weight: product.product_id.weight,
      category: product.product_id.category,
      brand: product.product_id.brand,
      purchased_quantity: product.quantity,
    })),
    shipping_address: {
      firstName: order.shipping_address.firstName,
      lastName: order.shipping_address.lastName,
      emailOrPhone: order.shipping_address.emailOrPhone,
      mobileNumber: order.shipping_address.mobileNumber,
      address: order.shipping_address.address,
      city: order.shipping_address.city,
      state: order.shipping_address.state,
      zip_code: order.shipping_address.zip_code,
    },
    isDelivered: order.isDelivered,
    isShipped: order.isShipped,
    track_url: order.track_url,
    isCashOnDelivery: order.isCashOnDelivery,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    isDeleted: order.isDeleted,
    paymentDate: order.paymentDate,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));
  return transformedOrders;
};

// update order
const updateAOrderInDB = async (orderId: string, orderUpdates: any) => {
  // check if the order is exists
  const isOrderExists = await Order.isOrderExistsByIdAndNotDeleted(orderId);

  if (!isOrderExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This order dose not exists!');
  }

  const order = await Order.findByIdAndUpdate(orderId, orderUpdates, {
    new: true,
  });

  return order;
};

export const OrderServices = {
  getAllOrdersByUserIDFromDB,
  getAllOrdersFromDBForAdminPanel,
  updateAOrderInDB,
};
