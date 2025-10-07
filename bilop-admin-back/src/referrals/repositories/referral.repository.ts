import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Referral } from '../entities/referral.entity/referral.entity';
import { IReferral, ICreateReferral, IUpdateReferral } from '../interfaces/referral.interface';
import { FilterReferralDto } from '../dto/filter-referral.dto';

@Injectable()
export class ReferralRepository {
  constructor(
    @InjectRepository(Referral)
    private readonly repository: Repository<Referral>
  ) {}

  public async findAll(filterDto?: FilterReferralDto): Promise<Referral[]> {
    const query = this.repository.createQueryBuilder('referral')
      .leftJoinAndSelect('referral.referrer', 'referrer');

    if (filterDto) {
      if (filterDto.search) {
        query.andWhere('referral.referredEmail LIKE :search', { search: `%${filterDto.search}%` });
      }

      if (filterDto.status) {
        query.andWhere('referral.status = :status', { status: filterDto.status });
      }

      if (filterDto.referrerId) {
        query.andWhere('referral.referrerId = :referrerId', { referrerId: filterDto.referrerId });
      }

      // Add pagination
      if (filterDto.page && filterDto.limit) {
        query.skip((filterDto.page - 1) * filterDto.limit)
             .take(filterDto.limit);
      }
    }

    return query.getMany();
  }

  public async findOne(id: number): Promise<Referral> {
    const referral = await this.repository.findOne({ 
      where: { id },
      relations: ['referrer'],
    });
    if (!referral) {
      throw new Error(`Referral with ID ${id} not found`);
    }
    return referral;
  }

  public async findByReferrer(referrerId: number, filterDto?: FilterReferralDto): Promise<Referral[]> {
    const query = this.repository.createQueryBuilder('referral')
      .where('referral.referrerId = :referrerId', { referrerId });

    if (filterDto) {
      if (filterDto.search) {
        query.andWhere('referral.referredEmail LIKE :search', { search: `%${filterDto.search}%` });
      }

      if (filterDto.status) {
        query.andWhere('referral.status = :status', { status: filterDto.status });
      }

      // Add pagination
      if (filterDto.page && filterDto.limit) {
        query.skip((filterDto.page - 1) * filterDto.limit)
             .take(filterDto.limit);
      }
    }

    return query.getMany();
  }

  public async findByEmail(email: string): Promise<Referral | null> {
    return this.repository.findOne({
      where: { referredEmail: email },
      relations: ['referrer'],
    });
  }

  public async create(referral: ICreateReferral): Promise<Referral> {
    const newReferral = this.repository.create({
      ...referral,
      referrer: { id: referral.referrerId },
    });
    return this.repository.save(newReferral);
  }

  public async update(id: number, referral: IUpdateReferral): Promise<Referral> {
    await this.repository.update(id, referral);
    return this.findOne(id);
  }

  public async remove(id: number): Promise<void> {
    const referral = await this.findOne(id);
    if (referral) {
      await this.repository.remove(referral);
    }
  }
} 