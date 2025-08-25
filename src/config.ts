// todo: add dotenv at some point so we can get errors if env variables are missing.
export const APP_PORT = parseInt(process.env.APP_PORT as string);
export const APP_JWT_SECRET = process.env.APP_JWT_SECRET as string;
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
