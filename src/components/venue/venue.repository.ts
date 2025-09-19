import { Venue } from './venue.entity';
import { appDataSource } from '@/lib/typeorm/typeorm.index';

export const venueRepository = appDataSource.getRepository(Venue);
