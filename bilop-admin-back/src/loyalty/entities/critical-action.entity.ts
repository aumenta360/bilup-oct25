import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity/user.entity';
import { Program } from './program.entity';

@Entity()
export class CriticalAction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Program)
  program: Program;

  @Column({ length: 40 })
  actionType: string; // Ej: 'soft_delete', 'expire_config', etc.

  @Column({ type: 'jsonb', nullable: true })
  details: any; // Información adicional opcional (motivo, datos extra)

  @CreateDateColumn()
  createdAt: Date;
} 