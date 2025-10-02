import { User } from './user.entity';
import { AppDataSource } from '@/lib/typeorm/typeorm.index';

export const userRepository = AppDataSource.getRepository(User);
