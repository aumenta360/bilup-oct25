import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Card } from '../card.entity/card.entity';

@Entity()
export class CardLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => Card)
  @JoinColumn()
  card: Card;
} 