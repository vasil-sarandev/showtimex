import { Event } from '../../event/event.entity';
import { Performer } from '../../performer/performer.entity';
import { Ticket } from '../../ticket/ticket.entity';
import { Venue } from '../../venue/venue.entity';

export interface EventPageDataResponseDTO {
  event: Omit<Event, 'performers' | 'venue' | 'tickets'>;
  performers: Performer[];
  venue: Venue;
  tickets: Ticket[];
}
