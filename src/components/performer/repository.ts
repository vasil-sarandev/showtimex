import { Performer } from './entity';
import { appDataSource } from '@/lib/typeorm';

export const performerRepository = appDataSource.getRepository(Performer);
