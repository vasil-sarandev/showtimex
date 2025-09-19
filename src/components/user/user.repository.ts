import { User } from './user.entity';
import { appDataSource } from '@/lib/typeorm/typeorm.index';

export const userRepository = appDataSource.getRepository(User);
