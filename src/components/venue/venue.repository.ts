import { Venue } from './venue.entity';
import { AppDataSource } from '@/lib/typeorm/typeorm.index';

export const venueRepository = AppDataSource.getRepository(Venue);
