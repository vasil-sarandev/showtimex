import { eventService } from '../event/event.service';

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
}

export const backendForFrontEndService = new BackendForFrontEndService();
