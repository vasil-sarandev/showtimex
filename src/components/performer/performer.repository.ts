import { Performer } from './performer.entity';
import { AppDataSource } from '@/lib/typeorm/typeorm.index';

export const performerRepository = AppDataSource.getRepository(Performer);
