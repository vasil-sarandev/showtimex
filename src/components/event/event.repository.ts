import { Event } from './event.entity';
import { AppDataSource } from '@/lib/typeorm/typeorm.index';

export const eventRepository = AppDataSource.getRepository(Event);
