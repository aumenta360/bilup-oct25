import { Repository } from 'typeorm';
import { Card } from '../entities/card.entity/card.entity';
import { ICreateCard, IUpdateCard } from '../interfaces/card.interface';

export class CardRepository {
  private repository: Repository<Card>;

  constructor(repository: Repository<Card>) {
    this.repository = repository;
  }

  public async findAll(): Promise<Card[]> {
    return this.repository.find({
      relations: ['user'],
    });
  }

  public async findOne(id: number): Promise<Card> {
    const card = await this.repository.findOne({ 
      where: { id },
      relations: ['user'],
    });
    if (!card) {
      throw new Error(`Card with ID ${id} not found`);
    }
    return card;
  }

  public async findByUser(userId: number): Promise<Card[]> {
    return this.repository.find({
      where: { user: { id: userId } },
    });
  }

  public async create(card: ICreateCard): Promise<Card> {
    const newCard = this.repository.create({
      ...card,
      user: { id: card.userId },
    });
    return this.repository.save(newCard);
  }

  public async update(id: number, card: IUpdateCard): Promise<Card> {
    const updateData: any = { ...card };
    if (card.userId) {
      updateData.user = { id: card.userId };
    }
    await this.repository.update(id, updateData);
    return this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    const card = await this.findOne(id);
    await this.repository.remove(card);
  }
} 