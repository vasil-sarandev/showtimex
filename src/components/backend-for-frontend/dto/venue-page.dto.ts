import { Event } from '../../event/event.entity';
import { Venue } from '@/components/venue/venue.entity';

export interface VenuePageDTO {
  venue: Omit<Venue, 'events'>;
  events: Event[];
}
