import { Payment } from './payment.entity';
import { appDataSource } from '@/lib/typeorm/typeorm.index';

export const paymentRepository = appDataSource.getRepository(Payment);
