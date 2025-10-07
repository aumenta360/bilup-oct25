import { Repository } from 'typeorm';
import { Point } from '../entities/point.entity/point.entity';
import { ICreatePoint, IUpdatePoint } from '../interfaces/point.interface';

export class PointRepository {
  private repository: Repository<Point>;

  constructor(repository: Repository<Point>) {
    this.repository = repository;
  }

  public async findAll(): Promise<Point[]> {
    return this.repository.find({
      relations: ['user', 'pointType'],
    });
  }

  public async findOne(id: number): Promise<Point> {
    const point = await this.repository.findOne({ 
      where: { id },
      relations: ['user', 'pointType'],
    });
    if (!point) {
      throw new Error(`Point with ID ${id} not found`);
    }
    return point;
  }

  public async findByUser(userId: number): Promise<Point[]> {
    return this.repository.find({
      where: { user: { id: userId } },
      relations: ['pointType'],
    });
  }

  public async getUserTotalPoints(userId: number): Promise<number> {
    const points = await this.repository.find({
      where: { user: { id: userId } },
      relations: ['pointType'],
    });
    return points.reduce((total, point) => total + point.amount, 0);
  }

  public async create(point: ICreatePoint): Promise<Point> {
    const newPoint = this.repository.create({
      ...point,
      user: { id: point.userId },
      pointType: { id: point.pointTypeId },
    });
    return this.repository.save(newPoint);
  }

  public async update(id: number, point: IUpdatePoint): Promise<Point> {
    const updateData: any = { ...point };
    if (point.userId) {
      updateData.user = { id: point.userId };
    }
    if (point.pointTypeId) {
      updateData.pointType = { id: point.pointTypeId };
    }
    await this.repository.update(id, updateData);
    return this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    const point = await this.findOne(id);
    await this.repository.remove(point);
  }
} 