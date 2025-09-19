import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { Ticket } from '../ticket/ticket.entity';
import { Performer } from '../performer/performer.entity';
import { Venue } from '../venue/venue.entity';

const TITLE_MIN_LEN = 10;
const TITLE_MAX_LEN = 100;

@Entity()
export class Event {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  @Length(TITLE_MIN_LEN, TITLE_MAX_LEN)
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'date' })
  date: string;

  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Ticket[];

  @ManyToOne(() => Venue, venue => venue.events)
  venue: Venue;

  @ManyToMany(() => Performer, performer => performer.events)
  @JoinTable()
  performers: Performer[];
}
