import { PaginationParams } from '@/lib/util';

export interface CreateEventDTO {
  title: string;
  description?: string;
  venueId: number;
  performerIds: number[];
}

export interface EventSearchParams extends PaginationParams {
  term?: string;
  venueId?: string;
  date?: string;
}
