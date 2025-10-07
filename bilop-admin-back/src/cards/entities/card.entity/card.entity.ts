import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';
import { CardColors } from '../card-colors.entity/card-colors.entity';
import { CardImages } from '../card-images.entity/card-images.entity';
import { CardRegistration } from '../card-registration.entity/card-registration.entity';
import { CardAdvertising } from '../card-advertising.entity/card-advertising.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  primaryColor: string;

  @Column()
  secondaryColor: string;

  @Column()
  backgroundColor: string;

  @Column({ default: 'solid' })
  style: string;

  @Column({ default: 'points' })
  displayType: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => CardColors, { cascade: true })
  @JoinColumn()
  colors: CardColors;

  @OneToOne(() => CardImages, { cascade: true })
  @JoinColumn()
  images: CardImages;

  @OneToOne(() => CardRegistration, { cascade: true })
  @JoinColumn()
  registration: CardRegistration;

  @OneToOne(() => CardAdvertising, { cascade: true })
  @JoinColumn()
  advertising: CardAdvertising;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}