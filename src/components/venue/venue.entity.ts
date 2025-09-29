import { IsUrl, Length, Max, Min } from 'class-validator';
import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../event/event.entity';

const MIN_CAPACITY = 10;
const MAX_CAPACITY = 10000;

@Entity()
@Check(`"capacity" >= ${MIN_CAPACITY} AND "capacity" <= ${MAX_CAPACITY}`)
@Check(`
  "google_maps_url" ~ 
  '^https?:\\/\\/[a-zA-Z0-9.-]+(\\.[a-zA-Z]{2,})(:[0-9]+)?(\\/.*)?$'
`)
export class Venue {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', unique: true })
  @Length(5, 150)
  name: string;

  @Column({ type: 'int' })
  @Min(MIN_CAPACITY)
  @Max(MAX_CAPACITY)
  capacity: number;

  @Column({ type: 'varchar', nullable: true })
  @IsUrl()
  google_maps_url: string | null;

  // Event - OneToMany
  @OneToMany(() => Event, event => event.venue)
  events: Event[];
  // ---
}
