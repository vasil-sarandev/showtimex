import { DataSource } from 'typeorm';
import {
  APP_DATABASE_HOST,
  APP_DATABASE_PASSWORD,
  APP_DATABASE_PORT,
  APP_DATABASE_SYNCHRONIZE_FLAG,
  APP_DATABASE_TYPE,
  APP_DATABASE_USERNAME,
} from '@/config';

// forced to cast this because of TypeORM's type safety
const type = APP_DATABASE_TYPE as 'postgres' | 'mysql' | 'mongodb';

export const AppDataSource = new DataSource({
  type,
  host: APP_DATABASE_HOST,
  port: APP_DATABASE_PORT,
  username: APP_DATABASE_USERNAME,
  password: APP_DATABASE_PASSWORD,
  database: APP_DATABASE_USERNAME,
  synchronize: APP_DATABASE_SYNCHRONIZE_FLAG,
  logging: true,
  entities: [],
  subscribers: [],
  migrations: [],
});

export const initializeTypeORM = () => AppDataSource.initialize();
