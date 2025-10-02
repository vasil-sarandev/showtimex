import dotenv from 'dotenv';

// load the env file for migrations because typeorm-ts-node-commonjs doesn't support --env-file flag.
if (process.env.TYPEORM_ENV_CONFIG_PATH) {
  dotenv.config({ path: process.env.TYPEORM_ENV_CONFIG_PATH });
}

export const APP_PORT = parseInt(process.env.APP_PORT as string);
export const APP_JWT_SECRET = process.env.APP_JWT_SECRET as string;
export const APP_STRIPE_API_KEY = process.env.APP_STRIPE_API_KEY as string;
export const APP_STRIPE_PAYMENTS_WEBHOOK_SECRET_KEY = process.env
  .APP_STRIPE_PAYMENTS_WEBHOOK_SECRET_KEY as string;
// database
export const APP_DATABASE_TYPE = process.env.APP_DATABASE_TYPE as string;
export const APP_DATABASE_HOST = process.env.APP_DATABASE_HOST as string;
export const APP_DATABASE_PORT = parseInt(process.env.APP_DATABASE_PORT as string);
export const APP_DATABASE_USERNAME = process.env.APP_DATABASE_USERNAME as string;
export const APP_DATABASE_PASSWORD = process.env.APP_DATABASE_PASSWORD as string;
export const APP_DATABASE = process.env.APP_DATABASE as string;
export const APP_MOCK_AUTH = Boolean(process.env.APP_MOCK_AUTH as string);
export const APP_DATABASE_SYNCHRONIZE_FLAG = Boolean(
  process.env.APP_DATABASE_SYNCHRONIZE_FLAG as string,
);
