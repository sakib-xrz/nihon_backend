/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getValue } from 'node-global-storage';
import axios from 'axios';
import bkashAuth from '../../middlewares/bKashAuth';
import config from '../../config';
import { Order } from '../Order/order.model';
import { Product } from '../Product/product.model';

const router = Router();

// create payment -- done
router.post(
  '/payment/create',
  bkashAuth,
  async (req: Request, res: Response) => {
    const { user, total_price, shipping_address, payment_method, products } =
      req.body;

    const merchantInvoiceNumber = 'Inv' + uuidv4().substring(0, 5);
    // Convert the products array to a JSON string and encode it for the URL
    const encodedProducts = encodeURIComponent(JSON.stringify(products));
    const encodedShipping_address = encodeURIComponent(
      JSON.stringify(shipping_address),
    );
    try {
      const { data } = await axios.post(
        config.bkash.create_payment_url as string,
        {
          mode: '0011',
          payerReference: ' ',
          callbackURL: `${config.bkash.callback_url}?user=${user}&payment_method=${payment_method}&total_price=${total_price}&shipping_address=${encodedShipping_address}&products=${encodedProducts}`,
          amount: parseInt(total_price),
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber: merchantInvoiceNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: getValue('id_token'),
            'X-App-Key': config.bkash.api_key,
          },
        },
      );

      return res.status(200).json({ bkashURL: data.bkashURL });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message });
    }
  },
);

// Description: This endpoint is responsible for handling the callback from bKash
// What is callback: bKash will send a callback to this endpoint after the payment is done

// payment callback -- done
router.get(
  '/payment/callback',
  bkashAuth,
  async (req: Request, res: Response) => {
    const {
      paymentID,
      user,
      total_price,
      payment_method,
      merchantInvoiceNumber,
      status,
    } = req.query;

    const products = JSON.parse(
      decodeURIComponent(req.query.products as string),
    );

    const shipping_address = JSON.parse(
      decodeURIComponent(req.query.shipping_address as string),
    );

    if (status === 'cancel' || status === 'failure') {
      return res.redirect(`${config.base_url}/error?message=${status}`);
    }
    if (status === 'success') {
      try {
        const { data } = await axios.post(
          config.bkash.execute_payment_url as string,
          { paymentID },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: getValue('id_token'),
              'X-App-Key': config.bkash.api_key,
            },
          },
        );

        if (data && data.statusCode === '0000') {
          // save the payment data to the database
          await Order.create({
            user,
            TXID: data.trxID,
            total_price,
            products,
            payment_method,
            shipping_address,
            isCashOnDelivery: false,
            merchantInvoiceNumber,
            payment_status: 'Completed',
            paymentID: data.paymentID,
          });

          // iterating over each product and update the stock
          for (const item of products) {
            const { product_id, quantity } = item;

            // finding the product in the database
            const product = await Product.findById(product_id);

            if (product) {
              // checking if enough stock is available
              if (product.in_stock >= quantity) {
                // subtracting the ordered quantity from the stock
                product.in_stock -= quantity;

                // saving the updated product
                await product.save();
              } else {
                console.log(`Not enough stock for product ${product.name}`);
                // handling insufficient stock (e.g., throw an error or notify the user)
              }
            } else {
              console.log(`Product with ID ${product_id} not found`);
              // handling product not found
            }
          }

          return res.redirect(`${config.base_url}/success`);
        } else {
          return res.redirect(
            `${config.base_url}/error?message=${data.statusMessage}`,
          );
        }
      } catch (error: any) {
        return res.redirect(
          `${config.base_url}/error?message=${error.message}`,
        );
      }
    }
  },
);

export const bKashRoutes = router;
