import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity/card.entity';
import { CardColors } from './entities/card-colors.entity/card-colors.entity';
import { CardImages } from './entities/card-images.entity/card-images.entity';
import { CardLink } from './entities/card-links.entity/card-links.entity';
import { CardRegistration } from './entities/card-registration.entity/card-registration.entity';
import { CardAdvertising } from './entities/card-advertising.entity/card-advertising.entity';
import { CardService } from './services/card.service';
import { CardController } from './controllers/card.controller';
import { CardRepository } from './repositories/card.repository';
import { CardColorsService } from './services/card-colors.service';
import { CardImagesService } from './services/card-images.service';
import { CardLinksService } from './services/card-links.service';
import { CardRegistrationService } from './services/card-registration.service';
import { CardAdvertisingService } from './services/card-advertising.service';
import { FileUploadModule } from '../common/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Card,
      CardColors,
      CardImages,
      CardLink,
      CardRegistration,
      CardAdvertising
    ]),
    FileUploadModule
  ],
  controllers: [CardController],
  providers: [
    CardService,
    CardRepository,
    CardColorsService,
    CardImagesService,
    CardLinksService,
    CardRegistrationService,
    CardAdvertisingService
  ],
  exports: [
    CardService,
    CardColorsService,
    CardImagesService,
    CardLinksService,
    CardRegistrationService,
    CardAdvertisingService
  ]
})
export class CardsModule {}
