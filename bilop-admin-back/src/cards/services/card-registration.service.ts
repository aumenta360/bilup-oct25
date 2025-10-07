import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardRegistration } from '../entities/card-registration.entity/card-registration.entity';
import { CreateCardRegistrationDto } from '../dto/create-card-registration.dto';

@Injectable()
export class CardRegistrationService {
  constructor(
    @InjectRepository(CardRegistration)
    private cardRegistrationRepository: Repository<CardRegistration>,
  ) {}

  async create(createCardRegistrationDto: CreateCardRegistrationDto): Promise<CardRegistration> {
    const cardRegistration = this.cardRegistrationRepository.create(createCardRegistrationDto);
    return await this.cardRegistrationRepository.save(cardRegistration);
  }

  async findAll(): Promise<CardRegistration[]> {
    return await this.cardRegistrationRepository.find();
  }

  async findOne(id: number): Promise<CardRegistration> {
    const cardRegistration = await this.cardRegistrationRepository.findOne({ where: { id } });
    if (!cardRegistration) {
      throw new Error('Card registration not found');
    }
    return cardRegistration;
  }

  async findByCard(cardId: number): Promise<CardRegistration> {
    const cardRegistration = await this.cardRegistrationRepository.findOne({ 
      where: { card: { id: cardId } } 
    });
    if (!cardRegistration) {
      throw new Error('Card registration not found');
    }
    return cardRegistration;
  }

  async update(id: number, updateCardRegistrationDto: Partial<CreateCardRegistrationDto>): Promise<CardRegistration> {
    await this.cardRegistrationRepository.update(id, updateCardRegistrationDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cardRegistrationRepository.delete(id);
  }
} 