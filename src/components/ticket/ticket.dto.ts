export interface CreateTicketBatchDTO {
  eventId: number;
  price: number;
  count: number;
  section: string;
  type?: string;
}
