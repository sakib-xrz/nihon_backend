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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
// Define the Product Schema
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    images: [{ type: String, required: false }],
    price: { type: Number, required: true },
    in_stock: { type: Number, required: true },
    weight: { type: Number, required: false },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
    },
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Brand', required: false },
    reviews: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Review', default: [] }],
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
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals in JSON output
    toObject: { virtuals: true }, // Include virtuals in Object output
});
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
productSchema.statics.isProductExistsByIdAndNotDeleted = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({ _id: id, isDeleted: false })
            .populate('category')
            .populate('brand')
            .populate('reviews');
    });
};
exports.Product = (0, mongoose_1.model)('Product', productSchema);
