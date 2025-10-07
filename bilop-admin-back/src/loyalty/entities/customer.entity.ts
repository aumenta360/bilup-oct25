import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Program } from './program.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  firstName: string;

  @Column({ length: 40 })
  lastName: string;

  @Column({ length: 20, unique: true })
  phone: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ type: 'int', default: 0 })
  stamps: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'date', nullable: true })
  lastVisit: Date;

  @Column({ length: 50, nullable: true })
  origin: string;

  @ManyToOne(() => Program, program => program.customers)
  program: Program;
} 