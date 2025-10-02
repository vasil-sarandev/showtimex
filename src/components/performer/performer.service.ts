import { FindManyOptions, FindOneOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { Performer } from './performer.entity';
import { performerRepository } from './performer.repository';
import { CreatePerformerDTO } from './performer.dto';
import { PerformerSearchParams } from './performer.controller';
import { computePaginationParams } from '@/lib/shared';

class PerformerService {
  private repository: Repository<Performer>;
  constructor() {
    this.repository = performerRepository;
  }

  findOne = async (options: FindOneOptions<Performer>) => {
    return this.repository.findOne(options);
  };

  findOneOrFail = async (options: FindOneOptions<Performer>) => {
    return this.repository.findOneOrFail(options);
  };

  find = async (options: FindManyOptions<Performer>) => {
    return this.repository.find(options);
  };

  create = async (data: CreatePerformerDTO) => {
    const performer = this.repository.create(data);
    await validateOrReject(performer);
    return this.repository.save(performer);
  };

  search = async ({ name, ...rest }: PerformerSearchParams) => {
    const { skip, take } = computePaginationParams({ ...rest });
    const where: FindOptionsWhere<Performer> = {};
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

export const performerService = new PerformerService();
