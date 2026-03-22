import { FindOneOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { venueRepository } from './venue.repository';
import { Venue } from './venue.entity';
import { CreateVenueDTO } from './venue.dto';
import { VenueSearchParams } from './venue.controller';
import { computePaginationParams } from '@/lib/shared';

class VenueService {
  private repository: Repository<Venue>;
  constructor() {
    this.repository = venueRepository;
  }

  create = async (data: CreateVenueDTO) => {
    const event = this.repository.create(data);
    await validateOrReject(event);
    return this.repository.save(event);
  };

  findOne = async (options: FindOneOptions<Venue>) => {
    return this.repository.findOne(options);
  };

  findOneOrFail = async (options: FindOneOptions<Venue>) => {
    return this.repository.findOneOrFail(options);
  };

  search = async ({ name, ...rest }: VenueSearchParams) => {
    const { skip, take } = computePaginationParams({ ...rest });

    const where: FindOptionsWhere<Venue> = {};
    if (name) {
      where.name = ILike(`%${name}%`);
    }

    return this.repository.findAndCount({
      where,
      skip,
      take,
    });
  };
}

export const venueService = new VenueService();
