import { Repository } from 'typeorm';
import { Promotion } from '../entities/promotion.entity';
import { ICreatePromotion, IUpdatePromotion } from '../interfaces/promotion.interface';

export class PromotionRepository {
  private repository: Repository<Promotion>;

  constructor(repository: Repository<Promotion>) {
    this.repository = repository;
  }

  public async findAll(): Promise<Promotion[]> {
    return this.repository.find();
  }

  public async findOne(id: number): Promise<Promotion> {
    const promotion = await this.repository.findOne({ where: { id } });
    if (!promotion) {
      throw new Error(`Promotion with ID ${id} not found`);
    }
    return promotion;
  }

  public async findActive(): Promise<Promotion[]> {
    return this.repository.find({
      where: { isActive: true },
    });
  }

  public async create(promotion: ICreatePromotion): Promise<Promotion> {
    const newPromotion = this.repository.create({
      ...promotion,
      startDate: new Date(promotion.startDate),
      endDate: new Date(promotion.endDate),
    });
    return this.repository.save(newPromotion);
  }

  public async update(id: number, promotion: IUpdatePromotion): Promise<Promotion> {
    const updateData: any = { ...promotion };
    if (promotion.startDate) {
      updateData.startDate = new Date(promotion.startDate);
    }
    if (promotion.endDate) {
      updateData.endDate = new Date(promotion.endDate);
    }
    await this.repository.update(id, updateData);
    return this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    const promotion = await this.findOne(id);
    await this.repository.remove(promotion);
  }
} 