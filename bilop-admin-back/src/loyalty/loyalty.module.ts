import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyController } from './loyalty.controller';
import { LoyaltyService } from './loyalty.service';
import { Program } from './entities/program.entity';
import { User } from '../users/entities/user.entity/user.entity';
import { Reward } from './entities/reward.entity';
import { ShareLink } from './entities/share-link.entity';
import { Customer } from './entities/customer.entity';
import { PushMessage, PushMessageSend } from './entities/push-message.entity';
import { CriticalAction } from './entities/critical-action.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Program,
    User,
    Reward,
    ShareLink,
    Customer,
    PushMessage,
    PushMessageSend,
    CriticalAction
  ]), UsersModule],
  controllers: [LoyaltyController],
  providers: [LoyaltyService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {} 