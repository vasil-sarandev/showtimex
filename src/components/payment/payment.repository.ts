import { Payment } from './payment.entity';
import { appDataSource } from '@/lib/services/typeorm';

export const paymentRepository = appDataSource.getRepository(Payment);
