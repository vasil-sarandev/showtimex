import { Ticket } from './ticket.entity';

export const extractSeatNumberFromTicket = (ticket: Ticket | null): number => {
  if (!ticket) {
    return 0;
  }
  const match = ticket.seat.match(/\d+$/);
  return match ? parseInt(match[0], 10) : 0;
};

export const generateSeats = ({
  section,
  startNumber,
  count,
}: {
  section: string;
  startNumber: number;
  count: number;
}): string[] => {
  return Array.from({ length: count }, (_, index) => `${section}${startNumber + index}`);
};
