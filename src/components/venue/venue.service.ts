import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { venueRepository } from './venue.repository';
import { Venue } from './venue.entity';

class VenueService {
  private repository: Repository<Venue>;
  constructor() {
    this.repository = venueRepository;
  }

  create = async (data: DeepPartial<Venue>) => {
    const event = this.repository.create(data);
    await validateOrReject(event);
    return this.repository.save(event);
  };

  findOne = async (options: FindOneOptions<Venue>) => {
    return this.repository.findOne(options);
  };
}

export const venueService = new VenueService();
