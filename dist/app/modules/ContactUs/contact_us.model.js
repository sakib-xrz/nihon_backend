"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact_Us = void 0;
const mongoose_1 = require("mongoose");
// Define Mongoose schema for Contact
const contactUsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    subject: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    is_contacted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.Contact_Us = (0, mongoose_1.model)('Contact_Us', contactUsSchema);
