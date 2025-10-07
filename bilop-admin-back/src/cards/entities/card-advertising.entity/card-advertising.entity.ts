import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Card } from '../card.entity/card.entity';

@Entity()
export class CardAdvertising {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  templateName: string;

  @Column({ nullable: true })
  promotionalImage: string;

  @Column({ nullable: true })
  promotionalText: string;

  @Column({ default: true })
  includeQR: boolean;

  @Column({ nullable: true })
  customBackground: string;

  @Column({ nullable: true })
  customFont: string;

  @OneToOne(() => Card)
  @JoinColumn()
  card: Card;
} 