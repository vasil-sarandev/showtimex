import { Event } from './event.entity';

export interface CreateEventDTO {
  title: string;
  description?: string;
  venueId: number;
  performerIds: number[];
  date: string;
}

// default dto - no relations
export type EventResponseDTO = Omit<Event, 'performers' | 'tickets' | 'venue'>;
