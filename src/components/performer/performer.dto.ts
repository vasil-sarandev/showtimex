import { Performer } from './performer.entity';

export interface CreatePerformerDTO {
  name: string;
  social_url: string;
  label: string;
}

// default dto - no relations
export type PerformerResponseDTO = Omit<Performer, 'events'>;
