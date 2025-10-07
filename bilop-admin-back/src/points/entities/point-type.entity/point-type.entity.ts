import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Point } from '../point.entity/point.entity';

@Entity()
export class PointType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  value: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Point, point => point.pointType)
  points: Point[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}