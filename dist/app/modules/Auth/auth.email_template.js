"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlTemplate = void 0;
const config_1 = __importDefault(require("../../config"));
const htmlTemplate = (resetUILink) => `
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="#" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">${config_1.default.brand.brand_name}</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing ${config_1.default.brand.brand_name}. Use the following OTP to complete your Forgot password procedures. OTP is valid for 10 minutes</p>
   <a href="${resetUILink}" style="background: #00466a; margin: 0 auto; width: max-content; padding: 10px 20px; color: #fff; border-radius: 4px; text-decoration: none;">Reset Password</a>
    <p style="font-size:0.9em;">Regards,<br />${config_1.default.brand.brand_name}</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>${config_1.default.brand.brand_name} Inc</p>
      <p>${config_1.default.brand.brand_location}</p>
      <p>${config_1.default.brand.brand_country}</p>
    </div>
  </div>
</div>
`;
exports.htmlTemplate = htmlTemplate;
