import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardAdvertising } from '../entities/card-advertising.entity/card-advertising.entity';
import { CreateCardAdvertisingDto } from '../dto/create-card-advertising.dto';

@Injectable()
export class CardAdvertisingService {
  constructor(
    @InjectRepository(CardAdvertising)
    private cardAdvertisingRepository: Repository<CardAdvertising>,
  ) {}

  async create(createCardAdvertisingDto: CreateCardAdvertisingDto): Promise<CardAdvertising> {
    const cardAdvertising = this.cardAdvertisingRepository.create(createCardAdvertisingDto);
    return await this.cardAdvertisingRepository.save(cardAdvertising);
  }

  async findAll(): Promise<CardAdvertising[]> {
    return await this.cardAdvertisingRepository.find();
  }

  async findOne(id: number): Promise<CardAdvertising> {
    const cardAdvertising = await this.cardAdvertisingRepository.findOne({ where: { id } });
    if (!cardAdvertising) {
      throw new Error('Card advertising not found');
    }
    return cardAdvertising;
  }

  async findByCard(cardId: number): Promise<CardAdvertising> {
    const cardAdvertising = await this.cardAdvertisingRepository.findOne({ 
      where: { card: { id: cardId } } 
    });
    if (!cardAdvertising) {
      throw new Error('Card advertising not found');
    }
    return cardAdvertising;
  }

  async update(id: number, updateCardAdvertisingDto: Partial<CreateCardAdvertisingDto>): Promise<CardAdvertising> {
    await this.cardAdvertisingRepository.update(id, updateCardAdvertisingDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cardAdvertisingRepository.delete(id);
  }
} 