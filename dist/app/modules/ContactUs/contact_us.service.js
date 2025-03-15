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
exports.ContactUsServices = void 0;
const contact_us_model_1 = require("./contact_us.model");
// contact us
const addContactUsDataToDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newContact = new contact_us_model_1.Contact_Us(payload);
    yield newContact.save();
});
// update contact us status
const updateContactUsStatus = (id, is_contacted) => __awaiter(void 0, void 0, void 0, function* () {
    yield contact_us_model_1.Contact_Us.findByIdAndUpdate(id, { is_contacted });
});
exports.ContactUsServices = {
    addContactUsDataToDB,
    updateContactUsStatus,
};
