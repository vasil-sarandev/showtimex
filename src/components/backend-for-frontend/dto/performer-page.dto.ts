import { Event } from '../../event/event.entity';
import { Performer } from '../../performer/performer.entity';

export interface PerformerPageDTO {
  performer: Omit<Performer, 'events'>;
  events: Event[];
}
