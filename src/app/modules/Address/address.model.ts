import { Schema, model } from 'mongoose';
import { AddressModel, TAddress } from './address.interface';

const AddressSchema = new Schema<TAddress, AddressModel>(
  {
    present_address: { type: String, required: false },
    billing_address: { type: String, required: false },
    isDeleted: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

AddressSchema.statics.isAddressExistsByIdAndNotDeleted = async function (
  id: string,
) {
  return await Address.findOne({ _id: id, isDeleted: false });
};

export const Address = model<TAddress, AddressModel>('Address', AddressSchema);
