import { eventService } from '../event/event.service';
import { performerService } from '../performer/performer.service';
import { venueService } from '../venue/venue.service';

class BackendForFrontEndService {
  constructor() {}

  getEventPageData = async (eventId: number) => {
    const { venue, tickets, performers, ...event } = await eventService.findOneOrFail({
      where: { id: eventId },
      relations: ['venue', 'tickets', 'performers'],
    });

    return {
      event: { ...event },
      venue,
      tickets,
      performers,
    };
  };

  getPerformerPageData = async (performerId: number) => {
    const { events, ...rest } = await performerService.findOneOrFail({
      where: { id: performerId },
      relations: ['events'],
    });

    return {
      performer: { ...rest },
      events,
    };
  };

  getVenuePageData = async (eventId: number) => {
    const { events, ...rest } = await venueService.findOneOrFail({
      where: { id: eventId },
      relations: ['events'],
    });

    return {
      venue: { ...rest },
      events,
    };
  };
}

export const bffService = new BackendForFrontEndService();
