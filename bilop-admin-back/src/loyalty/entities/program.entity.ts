import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity/user.entity';
import { Reward } from './reward.entity';
import { ShareLink } from './share-link.entity';
import { Customer } from './customer.entity';
import { PushMessage } from './push-message.entity';

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ default: 'stamps' })
  type: string;

  @Column({ type: 'int', default: 1, nullable: true })
  pointsPerPurchase: number;

  @Column({ type: 'int' })
  requiredStamps: number;

  @Column({ length: 200 })
  reward: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'hidden'],
    default: 'draft'
  })
  status: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true, length: 7 })
  primaryColor: string;

  @Column({ nullable: true, length: 7 })
  textColor: string;

  @Column({ nullable: true, length: 7 })
  secondaryColor: string;

  @Column({ nullable: true })
  logoImage: string;

  @Column({ nullable: true })
  backgroundImage: string;

  @Column({ nullable: true })
  stampImage: string;

  @Column({ type: 'int', default: 0 })
  preFilledStamps: number;

  @Column({
    type: 'enum',
    enum: ['unlimited', 'limit', 'reset'],
    default: 'unlimited'
  })
  onCompleteBehavior: 'unlimited' | 'limit' | 'reset';

  @Column({ nullable: true, type: 'text' })
  customStampIcon: string;

  @Column({ type: 'int', default: 0 })
  totalCustomers: number;

  @Column({ type: 'int', default: 0 })
  totalPoints: number;

  @Column({ type: 'int', default: 0 })
  totalRedemptions: number;

  @Column({ type: 'jsonb', nullable: true })
  termsAndConditions: {
    content: string;
    lastUpdated: Date;
  };

  @Column({ type: 'jsonb', nullable: true })
  usageLimits: {
    enabled: boolean;
    period: 'day' | 'week' | 'month';
    maxUses: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  expirationConfig: {
    enabled: boolean;
    type: 'days' | 'weeks' | 'months' | 'years';
    value: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  deletionLog: {
    deletedBy: number;
    deletedAt: Date;
    reason: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, user => user.programs)
  user: User;

  @OneToMany(() => Reward, reward => reward.program)
  rewards: Reward[];

  @OneToMany(() => ShareLink, shareLink => shareLink.program)
  shareLinks: ShareLink[];

  @OneToMany(() => Customer, customer => customer.program)
  customers: Customer[];

  @OneToMany(() => PushMessage, pushMessage => pushMessage.program)
  pushMessages: PushMessage[];
}