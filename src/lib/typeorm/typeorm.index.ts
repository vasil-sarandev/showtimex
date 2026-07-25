import path from 'path';
import { DataSource } from 'typeorm';
import {
  APP_DATABASE,
  APP_DATABASE_HOST,
  APP_DATABASE_PASSWORD,
  APP_DATABASE_PORT,
  APP_DATABASE_SSL_FLAG,
  APP_DATABASE_SYNCHRONIZE_FLAG,
  APP_DATABASE_TYPE,
  APP_DATABASE_USERNAME,
} from '../../config';

const type = APP_DATABASE_TYPE as 'postgres';

export const AppDataSource = new DataSource({
  type,
  host: APP_DATABASE_HOST,
  port: APP_DATABASE_PORT,
  username: APP_DATABASE_USERNAME,
  password: APP_DATABASE_PASSWORD,
  database: APP_DATABASE,
  ssl: APP_DATABASE_SSL_FLAG ? { rejectUnauthorized: false } : false,
  synchronize: APP_DATABASE_SYNCHRONIZE_FLAG,
  logging: true,
  entities: [path.join(__dirname, '../../components/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../../migrations/**/*{.ts,.js}')],
  subscribers: [],
});

export const initializeTypeORM = () => AppDataSource.initialize();
