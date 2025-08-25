import { Venue } from './entity';
import { appDataSource } from '@/lib/typeorm';

export const venueRepository = appDataSource.getRepository(Venue);
