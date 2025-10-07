import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../../users/entities/user.entity/user.entity';
import { PointType } from '../point-type.entity/point-type.entity';

@Entity()
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, user => user.points)
  user: User;

  @ManyToOne(() => PointType, pointType => pointType.points)
  pointType: PointType;

  @CreateDateColumn()
  createdAt: Date;
}