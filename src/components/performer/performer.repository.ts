import { Performer } from './performer.entity';
import { appDataSource } from '@/lib/typeorm/typeorm.index';

export const performerRepository = appDataSource.getRepository(Performer);
