"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bKashRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = require("express");
const uuid_1 = require("uuid");
const node_global_storage_1 = require("node-global-storage");
const axios_1 = __importDefault(require("axios"));
const bKashAuth_1 = __importDefault(require("../../middlewares/bKashAuth"));
const config_1 = __importDefault(require("../../config"));
const order_model_1 = require("../Order/order.model");
const product_model_1 = require("../Product/product.model");
const router = (0, express_1.Router)();
// create payment -- done
router.post('/payment/create', bKashAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, total_price, shipping_address, payment_method, products } = req.body;
    const merchantInvoiceNumber = 'Inv' + (0, uuid_1.v4)().substring(0, 5);
    // Convert the products array to a JSON string and encode it for the URL
    const encodedProducts = encodeURIComponent(JSON.stringify(products));
    const encodedShipping_address = encodeURIComponent(JSON.stringify(shipping_address));
    try {
        const { data } = yield axios_1.default.post(config_1.default.bkash.create_payment_url, {
            mode: '0011',
            payerReference: ' ',
            callbackURL: `${config_1.default.bkash.callback_url}?user=${user}&payment_method=${payment_method}&total_price=${total_price}&shipping_address=${encodedShipping_address}&products=${encodedProducts}`,
            amount: parseInt(total_price),
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: merchantInvoiceNumber,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: (0, node_global_storage_1.getValue)('id_token'),
                'X-App-Key': config_1.default.bkash.api_key,
            },
        });
        return res.status(200).json({ bkashURL: data.bkashURL });
    }
    catch (error) {
        return res.status(500).json({ error: error === null || error === void 0 ? void 0 : error.message });
    }
}));
// Description: This endpoint is responsible for handling the callback from bKash
// What is callback: bKash will send a callback to this endpoint after the payment is done
// payment callback -- done
router.get('/payment/callback', bKashAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentID, user, total_price, payment_method, merchantInvoiceNumber, status, } = req.query;
    const products = JSON.parse(decodeURIComponent(req.query.products));
    const shipping_address = JSON.parse(decodeURIComponent(req.query.shipping_address));
    if (status === 'cancel' || status === 'failure') {
        return res.redirect(`${config_1.default.base_url}/error?message=${status}`);
    }
    if (status === 'success') {
        try {
            const { data } = yield axios_1.default.post(config_1.default.bkash.execute_payment_url, { paymentID }, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: (0, node_global_storage_1.getValue)('id_token'),
                    'X-App-Key': config_1.default.bkash.api_key,
                },
            });
            if (data && data.statusCode === '0000') {
                // save the payment data to the database
                yield order_model_1.Order.create({
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
                    const product = yield product_model_1.Product.findById(product_id);
                    if (product) {
                        // checking if enough stock is available
                        if (product.in_stock >= quantity) {
                            // subtracting the ordered quantity from the stock
                            product.in_stock -= quantity;
                            // saving the updated product
                            yield product.save();
                        }
                        else {
                            console.log(`Not enough stock for product ${product.name}`);
                            // handling insufficient stock (e.g., throw an error or notify the user)
                        }
                    }
                    else {
                        console.log(`Product with ID ${product_id} not found`);
                        // handling product not found
                    }
                }
                return res.redirect(`${config_1.default.base_url}/success`);
            }
            else {
                return res.redirect(`${config_1.default.base_url}/error?message=${data.statusMessage}`);
            }
        }
        catch (error) {
            return res.redirect(`${config_1.default.base_url}/error?message=${error.message}`);
        }
    }
}));
exports.bKashRoutes = router;
