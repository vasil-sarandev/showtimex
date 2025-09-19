import { Performer } from './performer.entity';
import { appDataSource } from '@/lib/services/typeorm';

export const performerRepository = appDataSource.getRepository(Performer);
