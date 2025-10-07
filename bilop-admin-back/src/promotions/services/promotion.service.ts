import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Promotion } from '../entities/promotion.entity';
import { CreatePromotionDto } from '../dto/create-promotion.dto';
import { UpdatePromotionDto } from '../dto/update-promotion.dto';

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private promotionRepository: Repository<Promotion>
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    const promotion = this.promotionRepository.create(createPromotionDto);
    return this.promotionRepository.save(promotion);
  }

  async findAll() {
    return this.promotionRepository.find();
  }

  async findOne(id: number) {
    const promotion = await this.promotionRepository.findOne({
      where: { id }
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return promotion;
  }

  async findActive() {
    const currentDate = new Date();
    return this.promotionRepository.find({
      where: {
        startDate: LessThanOrEqual(currentDate),
        endDate: MoreThanOrEqual(currentDate),
        isActive: true
      }
    });
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto) {
    const promotion = await this.findOne(id);
    Object.assign(promotion, updatePromotionDto);
    return this.promotionRepository.save(promotion);
  }

  async remove(id: number) {
    const result = await this.promotionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
  }
} 