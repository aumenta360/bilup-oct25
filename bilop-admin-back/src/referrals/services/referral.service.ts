import { Injectable, NotFoundException } from '@nestjs/common';
import { ReferralRepository } from '../repositories/referral.repository';
import { ICreateReferral, IUpdateReferral } from '../interfaces/referral.interface';
import { FilterReferralDto } from '../dto/filter-referral.dto';

@Injectable()
export class ReferralService {
  constructor(private readonly repository: ReferralRepository) {}

  public async create(createReferralDto: ICreateReferral) {
    const existingReferral = await this.repository.findByEmail(createReferralDto.referredEmail);
    if (existingReferral) {
      throw new Error('Email already referred');
    }
    return this.repository.create(createReferralDto);
  }

  public async findAll(filterDto?: FilterReferralDto) {
    return this.repository.findAll(filterDto);
  }

  public async findOne(id: number) {
    const referral = await this.repository.findOne(id);
    if (!referral) {
      throw new NotFoundException(`Referral with ID ${id} not found`);
    }
    return referral;
  }

  public async findByReferrer(referrerId: number, filterDto?: FilterReferralDto) {
    return this.repository.findByReferrer(referrerId, filterDto);
  }

  public async findByEmail(email: string) {
    const referral = await this.repository.findByEmail(email);
    if (!referral) {
      throw new NotFoundException(`Referral with email ${email} not found`);
    }
    return referral;
  }

  public async update(id: number, updateReferralDto: IUpdateReferral) {
    await this.findOne(id); // Verify existence
    return this.repository.update(id, updateReferralDto);
  }

  public async remove(id: number) {
    await this.findOne(id); // Verify existence
    return this.repository.remove(id);
  }
} 