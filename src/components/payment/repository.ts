import { Payment } from './entity';
import { appDataSource } from '@/lib/typeorm';

export const paymentRepository = appDataSource.getRepository(Payment);
