import { Event } from '../event/event.entity';
import { Performer } from '../performer/performer.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Venue } from '../venue/venue.entity';

export interface EventPageResponseDTO {
  event: Omit<Event, 'performers' | 'venue' | 'tickets'>;
  performers: Performer[];
  venue: Venue;
  tickets: Ticket[];
}

export interface PerformerPageResponseDTO {
  performer: Omit<Performer, 'events'>;
  events: Event[];
}

export interface VenuePageResponseDTO {
  venue: Omit<Venue, 'events'>;
  events: Event[];
}
