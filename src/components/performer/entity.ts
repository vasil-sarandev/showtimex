import { IsUrl } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Event } from '../event/entity';

@Entity()
export class Performer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar' })
  @IsUrl()
  social_url: string;

  @ManyToMany(() => Event, event => event.performers)
  events: Event[];
}
