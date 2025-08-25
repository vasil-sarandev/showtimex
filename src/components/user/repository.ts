import { User } from './entity';
import { appDataSource } from '@/lib/typeorm';

export const userRepository = appDataSource.getRepository(User);
