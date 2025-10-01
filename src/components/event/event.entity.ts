import {
  Check,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Length } from 'class-validator';
import { Ticket } from '../ticket/ticket.entity';
import { Performer } from '../performer/performer.entity';
import { Venue } from '../venue/venue.entity';

const TITLE_MIN_LEN = 10;
const TITLE_MAX_LEN = 100;

@Entity()
@Check(`char_length("title") >= ${TITLE_MIN_LEN} AND char_length("title") <= ${TITLE_MAX_LEN}`)
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

  // Ticket (OneToMany)
  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets: Relation<Ticket>[];
  // ---

  // Venue (ManyToOne)
  @ManyToOne(() => Venue, venue => venue.events)
  @JoinColumn({ name: 'venueId' })
  venue: Relation<Venue>;

  @Column({ type: 'int' })
  venueId: number; // expose FK
  // ---

  // Performer (ManyToMany)
  @ManyToMany(() => Performer, performer => performer.events)
  @JoinTable()
  performers: Relation<Performer>[];
  // ---
}
