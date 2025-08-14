import { IsFQDN, Length, Min } from 'class-validator';
import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../event';

const MIN_CAPACITY = 500;

@Entity()
export class Venue {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  @Length(5, 150)
  name: string;

  @Column({ type: 'int' })
  @Min(MIN_CAPACITY)
  @Check(`"capacity" >= ${MIN_CAPACITY}`)
  capacity: number;

  @Column({ type: 'varchar', nullable: true })
  @IsFQDN()
  google_maps_url: string | null;

  @OneToMany(() => Event, event => event.venue)
  events: Event[];
}
