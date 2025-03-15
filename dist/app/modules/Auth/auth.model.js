"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetToken = void 0;
const mongoose_1 = require("mongoose");
const PasswordResetTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});
exports.PasswordResetToken = (0, mongoose_1.model)('PasswordResetToken', PasswordResetTokenSchema);
