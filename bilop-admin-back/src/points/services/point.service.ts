import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Point } from '../entities/point.entity/point.entity';
import { CreatePointDto } from '../dto/create-point.dto';
import { UpdatePointDto } from '../dto/update-point.dto';
import { User } from '../../users/entities/user.entity/user.entity';
import { PointType } from '../entities/point-type.entity/point-type.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PointType)
    private pointTypeRepository: Repository<PointType>
  ) {}

  async create(createPointDto: CreatePointDto) {
    // Buscar el usuario y el tipo de punto
    const user = await this.userRepository.findOne({
      where: { id: createPointDto.userId }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createPointDto.userId} not found`);
    }

    const pointType = await this.pointTypeRepository.findOne({
      where: { id: createPointDto.pointTypeId }
    });

    if (!pointType) {
      throw new NotFoundException(`Point type with ID ${createPointDto.pointTypeId} not found`);
    }

    // Crear el punto con las relaciones
    const point = this.pointRepository.create({
      ...createPointDto,
      user,
      pointType
    });

    // Guardar y devolver con las relaciones cargadas
    await this.pointRepository.save(point);
    
    return this.pointRepository.findOne({
      where: { id: point.id },
      relations: ['user', 'pointType']
    });
  }

  async findAll() {
    return this.pointRepository.find({
      relations: ['user', 'pointType']
    });
  }

  async findOne(id: number) {
    return this.pointRepository.findOne({
      where: { id },
      relations: ['user', 'pointType']
    });
  }

  async findByUser(userId: number) {
    return this.pointRepository.find({
      where: { user: { id: userId } },
      relations: ['pointType']
    });
  }

  async getUserTotalPoints(userId: number) {
    const points = await this.pointRepository.find({
      where: { user: { id: userId } },
      relations: ['pointType']
    });
    
    return points.reduce((total, point) => total + (point.amount * point.pointType.value), 0);
  }

  async update(id: number, updatePointDto: UpdatePointDto) {
    await this.pointRepository.update(id, updatePointDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.pointRepository.delete(id);
  }
}