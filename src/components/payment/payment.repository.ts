import { Payment } from './payment.entity';
import { AppDataSource } from '@/lib/typeorm/typeorm.index';

export const paymentRepository = AppDataSource.getRepository(Payment);
