export interface CreateEventDTO {
  title: string;
  description?: string;
  venueId: number;
  performerIds: number[];
}
