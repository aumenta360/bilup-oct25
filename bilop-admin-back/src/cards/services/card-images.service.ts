import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardImages } from '../entities/card-images.entity/card-images.entity';
import { CreateCardImagesDto } from '../dto/create-card-images.dto';
import { FileUploadService } from '../../common/services/file-upload.service';

@Injectable()
export class CardImagesService {
  constructor(
    @InjectRepository(CardImages)
    private cardImagesRepository: Repository<CardImages>,
    private fileUploadService: FileUploadService,
  ) {}

  async create(createCardImagesDto: CreateCardImagesDto): Promise<CardImages> {
    const cardImages = this.cardImagesRepository.create(createCardImagesDto);
    return await this.cardImagesRepository.save(cardImages);
  }

  async findAll(): Promise<CardImages[]> {
    return await this.cardImagesRepository.find();
  }

  async findOne(id: number): Promise<CardImages> {
    const cardImages = await this.cardImagesRepository.findOne({ where: { id } });
    if (!cardImages) {
      throw new Error('Card images not found');
    }
    return cardImages;
  }

  async update(id: number, updateCardImagesDto: Partial<CreateCardImagesDto>): Promise<CardImages> {
    const cardImages = await this.findOne(id);
    
    // Si hay nuevas imágenes, eliminar las antiguas
    if (updateCardImagesDto.squareLogo && cardImages.squareLogo) {
      await this.fileUploadService.deleteFile(cardImages.squareLogo);
    }
    if (updateCardImagesDto.horizontalLogo && cardImages.horizontalLogo) {
      await this.fileUploadService.deleteFile(cardImages.horizontalLogo);
    }
    if (updateCardImagesDto.cardCoverImage && cardImages.cardCoverImage) {
      await this.fileUploadService.deleteFile(cardImages.cardCoverImage);
    }
    if (updateCardImagesDto.registrationPageMobileImage && cardImages.registrationPageMobileImage) {
      await this.fileUploadService.deleteFile(cardImages.registrationPageMobileImage);
    }
    if (updateCardImagesDto.registrationPageDesktopImage && cardImages.registrationPageDesktopImage) {
      await this.fileUploadService.deleteFile(cardImages.registrationPageDesktopImage);
    }
    if (updateCardImagesDto.promotionalImage && cardImages.promotionalImage) {
      await this.fileUploadService.deleteFile(cardImages.promotionalImage);
    }

    await this.cardImagesRepository.update(id, updateCardImagesDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const cardImages = await this.findOne(id);
    
    // Eliminar todas las imágenes asociadas
    if (cardImages.squareLogo) {
      await this.fileUploadService.deleteFile(cardImages.squareLogo);
    }
    if (cardImages.horizontalLogo) {
      await this.fileUploadService.deleteFile(cardImages.horizontalLogo);
    }
    if (cardImages.cardCoverImage) {
      await this.fileUploadService.deleteFile(cardImages.cardCoverImage);
    }
    if (cardImages.registrationPageMobileImage) {
      await this.fileUploadService.deleteFile(cardImages.registrationPageMobileImage);
    }
    if (cardImages.registrationPageDesktopImage) {
      await this.fileUploadService.deleteFile(cardImages.registrationPageDesktopImage);
    }
    if (cardImages.promotionalImage) {
      await this.fileUploadService.deleteFile(cardImages.promotionalImage);
    }

    await this.cardImagesRepository.delete(id);
  }

  async uploadImage(file: Express.Multer.File, type: string): Promise<string> {
    // Validar dimensiones según el tipo de imagen
    const dimensions = this.getRequiredDimensions(type);
    const isValid = await this.fileUploadService.validateImageDimensions(
      file,
      dimensions.width,
      dimensions.height
    );

    if (!isValid) {
      throw new Error(`Invalid image dimensions for ${type}. Required: ${dimensions.width}x${dimensions.height}`);
    }

    return await this.fileUploadService.uploadFile(file, `cards/${type}`);
  }

  private getRequiredDimensions(type: string): { width: number; height: number } {
    switch (type) {
      case 'squareLogo':
        return { width: 150, height: 150 };
      case 'horizontalLogo':
        return { width: 480, height: 150 };
      case 'cardCoverImage':
        return { width: 2000, height: 800 };
      case 'registrationPageMobileImage':
        return { width: 750, height: 1334 };
      case 'registrationPageDesktopImage':
        return { width: 1920, height: 1080 };
      case 'promotionalImage':
        return { width: 1200, height: 630 };
      default:
        throw new Error(`Unknown image type: ${type}`);
    }
  }
} 