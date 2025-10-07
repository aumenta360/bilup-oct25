import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardColors } from '../entities/card-colors.entity/card-colors.entity';
import { CreateCardColorsDto } from '../dto/create-card-colors.dto';

@Injectable()
export class CardColorsService {
  constructor(
    @InjectRepository(CardColors)
    private cardColorsRepository: Repository<CardColors>,
  ) {}

  async create(createCardColorsDto: CreateCardColorsDto): Promise<CardColors> {
    const cardColors = this.cardColorsRepository.create(createCardColorsDto);
    return await this.cardColorsRepository.save(cardColors);
  }

  async findAll(): Promise<CardColors[]> {
    return await this.cardColorsRepository.find();
  }

  async findOne(id: number): Promise<CardColors | null> {
    return await this.cardColorsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCardColorsDto: Partial<CreateCardColorsDto>): Promise<CardColors | null> {
    await this.cardColorsRepository.update(id, updateCardColorsDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cardColorsRepository.delete(id);
  }
} 