import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Card } from '../card.entity/card.entity';

@Entity()
export class CardRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pageName: string;

  @Column({ nullable: true })
  circularLogo: string;

  @Column({ default: true })
  showName: boolean;

  @Column({ default: true })
  showLastName: boolean;

  @Column({ default: true })
  showEmail: boolean;

  @Column({ default: true })
  showPhone: boolean;

  @Column({ default: false })
  showBirthday: boolean;

  @Column({ default: false })
  showGender: boolean;

  @Column('jsonb', { nullable: true })
  customFields: {
    name: string;
    type: 'dropdown' | 'text' | 'number' | 'date';
    options?: string[];
    required: boolean;
  }[];

  @OneToOne(() => Card)
  @JoinColumn()
  card: Card;
} 