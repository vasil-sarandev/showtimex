import { Event } from './event.entity';
import { appDataSource } from '@/lib/typeorm/typeorm.index';

export const eventRepository = appDataSource.getRepository(Event);
