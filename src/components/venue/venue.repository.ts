import { Venue } from './venue.entity';
import { appDataSource } from '@/lib/services/typeorm';

export const venueRepository = appDataSource.getRepository(Venue);
