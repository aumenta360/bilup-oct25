import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Referral } from './entities/referral.entity/referral.entity';
import { ReferralService } from './services/referral.service';
import { ReferralController } from './controllers/referral.controller';
import { ReferralRepository } from './repositories/referral.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Referral]),
    UsersModule
  ],
  controllers: [ReferralController],
  providers: [ReferralService, ReferralRepository],
  exports: [ReferralService]
})
export class ReferralsModule {}
