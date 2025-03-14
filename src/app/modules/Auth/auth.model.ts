import { model, Schema, Types } from 'mongoose';

type TPasswordResetToken = {
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
};

const PasswordResetTokenSchema: Schema = new Schema<TPasswordResetToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const PasswordResetToken = model<TPasswordResetToken>(
  'PasswordResetToken',
  PasswordResetTokenSchema,
);
