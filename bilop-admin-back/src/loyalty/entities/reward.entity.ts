import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Program } from './program.entity';

@Entity()
export class Reward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  title: string;

  @Column({ type: 'int' })
  requiredStamps: number;

  @Column({ type: 'int', default: 0 })
  expirationDays: number;

  @Column({ default: true })
  pushEnabled: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  redemptionNote: {
    code: string;
    note: string;
    redeemedAt: Date;
    redeemedBy: number; // user_id
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Program, program => program.rewards)
  program: Program;
} 