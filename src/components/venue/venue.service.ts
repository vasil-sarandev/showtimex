import { DeepPartial, Repository } from 'typeorm';
import { venueRepository } from './venue.repository';
import { Venue } from './venue.entity';

class VenueService {
  private repository: Repository<Venue>;
  constructor() {
    this.repository = venueRepository;
  }

  create = async (data: DeepPartial)
}
