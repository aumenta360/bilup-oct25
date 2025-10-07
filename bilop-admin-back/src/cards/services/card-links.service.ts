import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardLink } from '../entities/card-links.entity/card-links.entity';
import { CreateCardLinkDto } from '../dto/create-card-link.dto';

@Injectable()
export class CardLinksService {
  constructor(
    @InjectRepository(CardLink)
    private cardLinksRepository: Repository<CardLink>,
  ) {}

  async create(createCardLinkDto: CreateCardLinkDto): Promise<CardLink> {
    const cardLink = this.cardLinksRepository.create(createCardLinkDto);
    return await this.cardLinksRepository.save(cardLink);
  }

  async findAll(): Promise<CardLink[]> {
    return await this.cardLinksRepository.find();
  }

  async findOne(id: number): Promise<CardLink> {
    const cardLink = await this.cardLinksRepository.findOne({ where: { id } });
    if (!cardLink) {
      throw new Error('Card link not found');
    }
    return cardLink;
  }

  async findByCard(cardId: number): Promise<CardLink[]> {
    return await this.cardLinksRepository.find({ where: { card: { id: cardId } } });
  }

  async update(id: number, updateCardLinkDto: Partial<CreateCardLinkDto>): Promise<CardLink> {
    await this.cardLinksRepository.update(id, updateCardLinkDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cardLinksRepository.delete(id);
  }
} 