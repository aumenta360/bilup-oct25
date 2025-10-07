import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Card } from '../card.entity/card.entity';

@Entity()
export class CardColors {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  primaryColor: string;

  @Column()
  secondaryColor: string;

  @Column()
  backgroundColor: string;

  @Column({ nullable: true })
  accentColor: string;

  @Column({ nullable: true })
  textColor: string;

  @OneToOne(() => Card)
  @JoinColumn()
  card: Card;
} 