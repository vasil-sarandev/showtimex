import { Event } from './entity';
import { appDataSource } from '@/lib/typeorm';

export const eventRepository = appDataSource.getRepository(Event);
