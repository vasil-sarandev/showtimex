import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { venueRepository } from './venue.repository';
import { Venue } from './venue.entity';

class VenueService {
  private repository: Repository<Venue>;
  constructor() {
    this.repository = venueRepository;
  }

  create = async (data: DeepPartial<Venue>) => {
    const event = this.repository.create(data);
    return this.repository.save(event);
  };

  findOne = async (options: FindOneOptions<Venue>) => {
    return this.repository.findOne(options);
  };
}

export const venueService = new VenueService();
