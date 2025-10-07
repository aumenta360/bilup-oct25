import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Card } from '../card.entity/card.entity';

@Entity()
export class CardImages {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  squareLogo: string;

  @Column({ nullable: true })
  horizontalLogo: string;

  @Column({ nullable: true })
  cardCoverImage: string;

  @Column({ nullable: true })
  registrationPageMobileImage: string;

  @Column({ nullable: true })
  registrationPageDesktopImage: string;

  @Column({ nullable: true })
  promotionalImage: string;

  @OneToOne(() => Card)
  @JoinColumn()
  card: Card;
} 