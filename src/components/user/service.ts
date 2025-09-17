import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';
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

  createUser = async (data: DeepPartial<User>) => {
    const user = this.repository.create(data);
    await this.repository.save(user);
    return user;
  };
}

export const userService = new UserService();
