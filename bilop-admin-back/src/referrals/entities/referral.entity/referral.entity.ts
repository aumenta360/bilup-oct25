import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';
import { ReferralStatus } from '../../dto/filter-referral.dto';

@Entity()
export class Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.referrals)
  referrer: User;

  @Column()
  referredEmail: string;

  @Column({ default: false })
  registered: boolean;

  @Column({ nullable: true })
  registeredUserId: number;

  @Column({
    type: 'enum',
    enum: ReferralStatus,
    default: ReferralStatus.PENDING
  })
  status: ReferralStatus;

  @CreateDateColumn()
  createdAt: Date;
}