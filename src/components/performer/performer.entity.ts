import { IsUrl } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Check } from 'typeorm';
import { Event } from '../event/event.entity';

@Entity()
@Check(`
  "social_url" ~ 
  '^https?:\\/\\/[a-zA-Z0-9.-]+(\\.[a-zA-Z]{2,})(:[0-9]+)?(\\/.*)?$'
`)
export class Performer {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar' })
  @IsUrl()
  social_url: string;

  @ManyToMany(() => Event, event => event.performers)
  events: Event[];
}
