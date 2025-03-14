import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  base_url: process.env.BASE_URL,
  api_url: process.env.API_URL,
  database_url: process.env.DATABASE_URL,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  jwt: {
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  },
  bkash: {
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
    api_key: process.env.BKASH_API_KEY,
    secret_key: process.env.BKASH_SECRET_KEY,
    grant_token_url: process.env.BKASH_GRANT_TOKEN_URL,
    create_payment_url: process.env.BKASH_CREATE_PAYMENT_URL,
    execute_payment_url: process.env.BKASH_EXECUTE_PAYMENT_URL,
    refund_transaction_url: process.env.BKASH_REFUND_TRANSACTION_URL,
    callback_url: process.env.BKASH_CALLBACK_URL,
  },
  brand: {
    brand_name: process.env.BRAND_NAME,
    brand_location: process.env.BRAND_LOCATION,
    brand_country: process.env.BRAND_COUNTRY,
  },
};
