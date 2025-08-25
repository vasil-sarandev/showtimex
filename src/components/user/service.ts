import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entity';
import { userRepository } from './repository';

class UserService {
  repository: Repository<User>;
  constructor(injectedRepository?: Repository<User>) {
    this.repository = injectedRepository ?? userRepository;
  }

  findOne = async ({ where }: { where?: FindOptionsWhere<User> }) => {
    return this.repository.findOne({ where });
  };
}

export const userService = new UserService();
