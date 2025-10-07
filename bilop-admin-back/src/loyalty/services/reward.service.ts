import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Reward } from '../entities/reward.entity';
import { Program } from '../entities/program.entity';
import { CreateRewardDto } from '../dto/create-reward.dto';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(Program)
    private programRepository: Repository<Program>,
  ) {}

  async create(programId: number, createRewardDto: CreateRewardDto): Promise<Reward> {
    const program = await this.programRepository.findOne({
      where: { id: programId },
      relations: ['rewards'],
    });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    // Validar límite de recompensas
    if (program.rewards.length >= 20) {
      throw new BadRequestException('Maximum number of rewards (20) reached for this program');
    }

    // Validar unicidad del título
    const existingReward = program.rewards.find(
      reward => reward.title.toLowerCase() === createRewardDto.title.toLowerCase()
    );
    if (existingReward) {
      throw new BadRequestException('A reward with this title already exists');
    }

    // Validar que las estampillas requeridas no excedan el total del programa
    if (createRewardDto.requiredStamps > program.requiredStamps) {
      throw new BadRequestException('Required stamps cannot exceed program total stamps');
    }

    const reward = this.rewardRepository.create({
      title: createRewardDto.title,
      requiredStamps: createRewardDto.requiredStamps,
      expirationDays: createRewardDto.expirationDays || 0,
      pushEnabled: createRewardDto.pushEnabled ?? true,
      program,
    });

    return this.rewardRepository.save(reward);
  }

  async findAll(programId: number): Promise<Reward[]> {
    const rewards = await this.rewardRepository.find({
      where: { program: { id: programId } },
      order: { createdAt: 'DESC' },
    });
    return rewards;
  }

  async findOne(id: number): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({
      where: { id },
      relations: ['program'],
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    return reward;
  }

  async update(id: number, updateRewardDto: Partial<CreateRewardDto>): Promise<Reward> {
    const reward = await this.findOne(id);

    // Validar unicidad del título si se está actualizando
    if (updateRewardDto.title) {
      const existingReward = await this.rewardRepository.findOne({
        where: {
          program: { id: reward.program.id },
          title: updateRewardDto.title,
          id: Not(id),
        },
      });

      if (existingReward) {
        throw new BadRequestException('A reward with this title already exists');
      }
    }

    // Validar estampillas requeridas si se están actualizando
    if (updateRewardDto.requiredStamps) {
      const program = await this.programRepository.findOne({
        where: { id: reward.program.id },
      });

      if (!program) {
        throw new NotFoundException('Program not found');
      }

      if (updateRewardDto.requiredStamps > program.requiredStamps) {
        throw new BadRequestException('Required stamps cannot exceed program total stamps');
      }
    }

    Object.assign(reward, updateRewardDto);
    return this.rewardRepository.save(reward);
  }

  async remove(id: number): Promise<void> {
    const reward = await this.findOne(id);
    await this.rewardRepository.softDelete(id);
  }
} 