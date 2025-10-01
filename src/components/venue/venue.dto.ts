import { Venue } from './venue.entity';

export interface CreateVenueDTO {
  name: string;
  capacity: number;
  google_maps_url: string;
}

// default dto - no relations
export type VenueResponseDTO = Omit<Venue, 'events'>;
