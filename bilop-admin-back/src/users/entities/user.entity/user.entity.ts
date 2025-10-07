import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Point } from '../../../points/entities/point.entity/point.entity';
import { Referral } from '../../../referrals/entities/referral.entity/referral.entity';
import { Program } from '../../../loyalty/entities/program.entity';

export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  gender: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => Point, point => point.user)
  points: Point[];

  @OneToMany(() => Referral, referral => referral.referrer)
  referrals: Referral[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @OneToMany(() => Program, program => program.user)
  programs: Program[];

}