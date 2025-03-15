"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customization = void 0;
const mongoose_1 = require("mongoose");
// customization Schema
const CustomizationSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.Customization = (0, mongoose_1.model)('Customization', CustomizationSchema);
