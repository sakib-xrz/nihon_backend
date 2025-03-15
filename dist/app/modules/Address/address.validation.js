"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressValidation = void 0;
const zod_1 = require("zod");
// Define the validation schema for the category add request
const addAndUpdateAddressValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        present_address: zod_1.z.string().optional(),
        billing_address: zod_1.z.string().optional(),
    }),
});
exports.AddressValidation = {
    addAndUpdateAddressValidationSchema,
};
