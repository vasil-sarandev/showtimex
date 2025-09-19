import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { Event } from './entity';
import { eventRepository } from './repository';
import { IPaginationParams } from '@/lib/common';

export interface IEventSearchParams extends IPaginationParams {
  term?: string;
  venueId?: string;
  date?: string;
}

class EventService {
  private repository: Repository<Event>;
  constructor() {
    this.repository = eventRepository;
  }

  create = async (data: DeepPartial<Event>) => {
    const event = this.repository.create(data);
    return this.repository.save(event);
  };

  findOne = async (options: FindOneOptions<Event>) => {
    return this.repository.findOne(options);
  };

  search = async ({ term, venueId, date, limit, page }: IEventSearchParams) => {
    const qb = this.repository.createQueryBuilder('event');
    if (venueId) {
      qb.andWhere('event.venueId = :venueId', { venueId: parseInt(venueId, 10) });
    }
    if (date) {
      qb.andWhere('event.date = :date', { date });
    }
    if (term) {
      qb.andWhere('(event.title ILIKE :term OR event.description ILIKE :term)', {
        term: `%${term}%`,
      });
    }
    return qb
      .skip((parseInt(page) - 1) * parseInt(limit))
      .take(parseInt(limit))
      .getManyAndCount();
  };
}

export const eventService = new EventService();
