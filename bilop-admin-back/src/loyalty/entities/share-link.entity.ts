import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Program } from './program.entity';

@Entity()
export class ShareLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  name: string;

  @Column({ unique: true })
  code: string; // Código único para la URL

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  visits: number;

  @Column({ default: 0 })
  registrations: number;

  @Column({ default: 0 })
  actions: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Program, program => program.shareLinks)
  program: Program;

  @Column({ type: 'int' })
  createdBy: number; // userId del owner
} 