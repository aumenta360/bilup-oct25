import { Repository } from 'typeorm';
import { PointType } from '../entities/point-type.entity/point-type.entity';
import { ICreatePointType, IUpdatePointType } from '../interfaces/point.interface';

export class PointTypeRepository {
  private repository: Repository<PointType>;

  constructor(repository: Repository<PointType>) {
    this.repository = repository;
  }

  public async findAll(): Promise<PointType[]> {
    return this.repository.find();
  }

  public async findOne(id: number): Promise<PointType> {
    const pointType = await this.repository.findOne({ where: { id } });
    if (!pointType) {
      throw new Error(`Point type with ID ${id} not found`);
    }
    return pointType;
  }

  public async create(pointType: ICreatePointType): Promise<PointType> {
    const newPointType = this.repository.create(pointType);
    return this.repository.save(newPointType);
  }

  public async update(id: number, pointType: IUpdatePointType): Promise<PointType> {
    await this.repository.update(id, pointType);
    return this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    const pointType = await this.findOne(id);
    await this.repository.remove(pointType);
  }
} 