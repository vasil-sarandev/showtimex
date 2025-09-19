import { User } from './user.entity';
import { appDataSource } from '@/lib/services/typeorm';

export const userRepository = appDataSource.getRepository(User);
