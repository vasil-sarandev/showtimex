import { FindOptionsWhere, Repository } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { Ticket } from '../ticket/ticket.entity';
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

  getCurrentUserTickets = async (userId: number): Promise<Ticket[] | null> => {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: ['tickets', 'tickets.event', 'tickets.payment'],
    });
    if (!user) {
      return null;
    }
    return user.tickets.sort((firstTicket, secondTicket) =>
      firstTicket.event.date.localeCompare(secondTicket.event.date),
    );
  };
}

export const userService = new UserService();
