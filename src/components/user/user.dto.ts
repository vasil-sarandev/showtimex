import { User } from './user.entity';

export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | undefined;
}

// default dto - no relations
export type UserResponseDTO = Omit<User, 'tickets' | 'payments'>;
