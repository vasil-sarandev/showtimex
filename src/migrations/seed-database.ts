import { ILike, MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../components/user/user.entity';
import { Performer } from '../components/performer/performer.entity';
import { Venue } from '../components/venue/venue.entity';
import { Event } from '../components/event/event.entity';
import { Ticket, TicketStatus } from '../components/ticket/ticket.entity';
import { generateSeats } from '../components/ticket/ticket.util';

const SEEDED_SUFFIX = '_SEEDED';

export class SeedDatabase1759383550375 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // need to insert in this order or FK constraints won't allow insertion:
    // Performers -> Venue -> Events -> Tickets
    // USERS
    const userRepo = queryRunner.manager.getRepository(User);
    const usersSeed = Array.from({ length: 10 }).map(() => ({
      first_name: faker.person.firstName() + SEEDED_SUFFIX,
      last_name: faker.person.lastName(),
      phone_number: faker.phone.number({ style: 'international' }),
      email: faker.internet.email(),
    }));
    await userRepo.save(usersSeed);
    // ---

    // PERFORMERS
    const performersRepo = queryRunner.manager.getRepository(Performer);
    const perfomersSeed = Array.from({ length: 10 }).map(() => ({
      name: faker.music.artist() + SEEDED_SUFFIX,
      social_url: faker.internet.url(),
      label: 'Independent',
    }));
    const performers = await performersRepo.save(perfomersSeed);
    // ---

    // VENUE
    const venueRepo = queryRunner.manager.getRepository(Venue);
    const venueSeed = Array.from({ length: 10 }).map(() => ({
      name: faker.company.name() + SEEDED_SUFFIX,
      google_maps_url: faker.internet.url(),
      capacity: faker.number.int({ min: 500, max: 5000 }),
    }));
    const venues = await venueRepo.save(venueSeed);
    // ---

    // EVENTS
    const eventRepo = queryRunner.manager.getRepository(Event);
    const eventSeed = Array.from({ length: 5 }).map(() => ({
      title: faker.lorem.words({ min: 2, max: 5 }) + SEEDED_SUFFIX,
      description: faker.lorem.paragraph(1),
      date: faker.date.future().toISOString().slice(0, 10),
      venueId: venues[Math.floor(Math.random() * venues.length)].id,
      performers: [
        {
          id: performers[Math.floor(Math.random() * performers.length)].id,
        },
      ],
    }));
    const events = await eventRepo.save(eventSeed);
    // ---

    // TICKETS
    const ticketRepo = queryRunner.manager.getRepository(Ticket);
    const ticketSeed = events.flatMap(event => {
      const vipSeats = generateSeats({ section: 'VIP', startNumber: 0, count: 50 });
      const regularSeats = generateSeats({ section: 'Regular', startNumber: 0, count: 100 });
      const seats = [...vipSeats, ...regularSeats];

      return seats.map(seat => ({
        price: seat.startsWith('VIP') ? 87.5 : 50,
        status: TicketStatus.available,
        type: seat.startsWith('VIP') ? 'VIP' + SEEDED_SUFFIX : 'Regular' + SEEDED_SUFFIX,
        seat,
        eventId: event.id,
      }));
    });
    await ticketRepo.save(ticketSeed);
    // ---
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // need to delete in inverse to insertion order so Foreign Key constraints don't prevent the operation.
    // (see the comment in *up* method for the order)

    // TICKETS
    await queryRunner.manager.getRepository(Ticket).delete({ type: ILike(`%${SEEDED_SUFFIX}`) });
    // EVENTS
    await queryRunner.manager.getRepository(Event).delete({ title: ILike(`%${SEEDED_SUFFIX}`) });
    // VENUES
    await queryRunner.manager.getRepository(Venue).delete({ name: ILike(`%${SEEDED_SUFFIX}`) });
    // PERFORMERS
    await queryRunner.manager.getRepository(Performer).delete({ name: ILike(`%${SEEDED_SUFFIX}`) });
    // USERS
    await queryRunner.manager
      .getRepository(User)
      .delete({ first_name: ILike(`%${SEEDED_SUFFIX}`) });
  }
}
