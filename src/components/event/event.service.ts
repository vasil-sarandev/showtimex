import { FindOneOptions, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { Event } from './event.entity';
import { eventRepository } from './event.repository';
import { EventSearchParams } from './event.controller';
import { CreateEventDTO } from './event.dto';
import { computePaginationParams } from '@/lib/shared';

class EventService {
  private repository: Repository<Event>;
  constructor() {
    this.repository = eventRepository;
  }

  create = async ({ title, description, date, venueId, performerIds }: CreateEventDTO) => {
    const event = this.repository.create({
      title,
      description,
      date,
      venueId,
      performers: performerIds.map(p => ({ id: p })),
    });
    await validateOrReject(event);
    return this.repository.save(event);
  };

  findOne = async (options: FindOneOptions<Event>) => {
    return this.repository.findOne(options);
  };

  findOneOrFail = async (options: FindOneOptions) => {
    return this.repository.findOneOrFail(options);
  };

  search = async ({ term, venueId, date, ...rest }: EventSearchParams) => {
    const { skip, take } = computePaginationParams({ ...rest });
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
    return qb.skip(skip).take(take).getManyAndCount();
  };
}

export const eventService = new EventService();
