import { IsUrl, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Check, Relation } from 'typeorm';
import { Event } from '../event/event.entity';

@Entity()
@Check(`
  "social_url" ~ 
  '^https?:\\/\\/[a-zA-Z0-9.-]+(\\.[a-zA-Z]{2,})(:[0-9]+)?(\\/.*)?$'
`)
export class Performer {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', unique: true })
  @Length(0, 100)
  name: string;

  @Column({ type: 'varchar', unique: true })
  @IsUrl()
  social_url: string;

  @Column({ type: 'varchar' })
  label: string;

  // Event - ManyToMany
  @ManyToMany(() => Event, event => event.performers)
  events: Relation<Event>[];
}
