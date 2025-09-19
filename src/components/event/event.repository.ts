import { Event } from './event.entity';
import { appDataSource } from '@/lib/services/typeorm';

export const eventRepository = appDataSource.getRepository(Event);
