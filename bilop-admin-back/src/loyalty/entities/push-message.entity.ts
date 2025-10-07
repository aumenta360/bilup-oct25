import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn, OneToMany } from 'typeorm';
import { Program } from './program.entity';

export type PushMessageStatus = 'draft' | 'scheduled' | 'sent';

@Entity()
export class PushMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40 })
  title: string;

  @Column({ length: 120 })
  message: string;

  @Column({ type: 'simple-array', nullable: true })
  origins: string[]; // códigos de share-link o "Todos"

  @Column({ type: 'int', default: 0 })
  exactStamps: number; // 0 = cualquiera

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'enum', enum: ['draft', 'scheduled', 'sent'], default: 'draft' })
  status: PushMessageStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Program, program => program.pushMessages)
  program: Program;

  @OneToMany(() => PushMessageSend, send => send.pushMessage)
  sends: PushMessageSend[];
}

@Entity()
export class PushMessageSend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PushMessage, pushMessage => pushMessage.sends)
  pushMessage: PushMessage;

  @Column({ length: 100 })
  customerEmail: string;

  @Column({ type: 'timestamp' })
  sentAt: Date;

  @Column({ type: 'enum', enum: ['sent', 'delivered', 'error'], default: 'sent' })
  status: 'sent' | 'delivered' | 'error';

  @Column({ nullable: true })
  errorMessage: string;
} 