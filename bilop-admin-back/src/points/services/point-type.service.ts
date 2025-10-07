import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointType } from '../entities/point-type.entity/point-type.entity';
import { CreatePointTypeDto } from '../dto/create-point-type.dto';
import { UpdatePointTypeDto } from '../dto/update-point-type.dto';

@Injectable()
export class PointTypeService {
  constructor(
    @InjectRepository(PointType)
    private pointTypeRepository: Repository<PointType>
  ) {}

  async create(createPointTypeDto: CreatePointTypeDto): Promise<PointType> {
    const pointType = this.pointTypeRepository.create({
      ...createPointTypeDto,
      points: []
    });
    return this.pointTypeRepository.save(pointType);
  }

  async findAll(): Promise<PointType[]> {
    return this.pointTypeRepository.find({
      relations: ['points']
    });
  }

  async findOne(id: number): Promise<PointType> {
    const pointType = await this.pointTypeRepository.findOne({
      where: { id },
      relations: ['points']
    });
    if (!pointType) {
      throw new NotFoundException(`Point type with ID ${id} not found`);
    }
    return pointType;
  }

  async update(id: number, updatePointTypeDto: UpdatePointTypeDto): Promise<PointType> {
    const pointType = await this.findOne(id);
    Object.assign(pointType, updatePointTypeDto);
    return this.pointTypeRepository.save(pointType);
  }

  async remove(id: number): Promise<void> {
    const result = await this.pointTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Point type with ID ${id} not found`);
    }
  }
}