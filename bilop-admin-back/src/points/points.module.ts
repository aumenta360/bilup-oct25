import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './entities/point.entity/point.entity';
import { PointType } from './entities/point-type.entity/point-type.entity';
import { PointService } from './services/point.service';
import { PointTypeService } from './services/point-type.service';
import { PointController } from './controllers/point.controller';
import { PointTypeController } from './controllers/point-type.controller';
import { PointRepository } from './repositories/point.repository';
import { PointTypeRepository } from './repositories/point-type.repository';
import { User } from '../users/entities/user.entity/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Point, PointType, User]),
    UsersModule
  ],
  controllers: [PointController, PointTypeController],
  providers: [
    PointService,
    PointTypeService,
    PointRepository,
    PointTypeRepository
  ],
  exports: [PointService, PointTypeService]
})
export class PointsModule {}