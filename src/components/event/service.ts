import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { Event } from './entity';
import { eventRepository } from './repository';

class EventService {
  private repository: Repository<Event>;
  constructor() {
    this.repository = eventRepository;
  }

  createEvent = async (data: DeepPartial<Event>) => {
    const event = this.repository.create(data);
    return this.repository.save(event);
  };

  getEventById = async (options: FindOneOptions<Event>) => {
    return this.repository.findOne(options);
  };
}

export const eventService = new EventService();
