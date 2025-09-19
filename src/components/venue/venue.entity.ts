import { IsUrl, Length, Max, Min } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../event/event.entity';

const MIN_CAPACITY = 10;
const MAX_CAPACITY = 10000;

@Entity()
export class Venue {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  @Length(5, 150)
  name: string;

  @Column({ type: 'int' })
  @Min(MIN_CAPACITY)
  @Max(MAX_CAPACITY)
  capacity: number;

  @Column({ type: 'varchar', nullable: true })
  @IsUrl()
  google_maps_url: string | null;

  @OneToMany(() => Event, event => event.venue)
  events: Event[];
}
