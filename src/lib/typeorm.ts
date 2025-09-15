import { DataSource } from 'typeorm';
import {
  APP_DATABASE,
  APP_DATABASE_HOST,
  APP_DATABASE_PASSWORD,
  APP_DATABASE_PORT,
  APP_DATABASE_SYNCHRONIZE_FLAG,
  APP_DATABASE_TYPE,
  APP_DATABASE_USERNAME,
} from '@/config';
import { Event } from '@/components/event/entity';
import { Performer } from '@/components/performer/entity';
import { Ticket } from '@/components/ticket/entity';
import { User } from '@/components/user/entity';
import { Venue } from '@/components/venue/entity';
import { Payment } from '@/components/payment/entity';

// forced to cast this because of TypeORM's type safety
const type = APP_DATABASE_TYPE as 'postgres' | 'mysql' | 'mongodb';

export const appDataSource = new DataSource({
  type,
  host: APP_DATABASE_HOST,
  port: APP_DATABASE_PORT,
  username: APP_DATABASE_USERNAME,
  password: APP_DATABASE_PASSWORD,
  database: APP_DATABASE,
  synchronize: APP_DATABASE_SYNCHRONIZE_FLAG,
  logging: true,
  entities: [Event, Performer, Ticket, Payment, User, Venue],
  subscribers: [],
  migrations: [],
});

export const initializeTypeORM = () => appDataSource.initialize();
