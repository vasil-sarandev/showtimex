import { FindOptionsWhere, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { User } from './user.entity';
import { userRepository } from './user.repository';
import { CreateUserDTO } from './user.dto';

class UserService {
  private repository: Repository<User>;
  constructor(injectedRepository?: Repository<User>) {
    this.repository = injectedRepository ?? userRepository;
  }

  findOne = async ({ where }: { where?: FindOptionsWhere<User> }) => {
    return this.repository.findOne({ where });
  };

  create = async (data: CreateUserDTO) => {
    const user = this.repository.create(data);
    await validateOrReject(user);
    return this.repository.save(user);
  };
}

export const userService = new UserService();
