import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CardService } from '../services/card.service';
import { CardColorsService } from '../services/card-colors.service';
import { CardImagesService } from '../services/card-images.service';
import { CardLinksService } from '../services/card-links.service';
import { CardRegistrationService } from '../services/card-registration.service';
import { CardAdvertisingService } from '../services/card-advertising.service';
import { CreateCardDto } from '../dto/create-card.dto';
import { CreateCardColorsDto } from '../dto/create-card-colors.dto';
import { CreateCardImagesDto } from '../dto/create-card-images.dto';
import { CreateCardLinkDto } from '../dto/create-card-link.dto';
import { CreateCardRegistrationDto } from '../dto/create-card-registration.dto';
import { CreateCardAdvertisingDto } from '../dto/create-card-advertising.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('cards')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly cardColorsService: CardColorsService,
    private readonly cardImagesService: CardImagesService,
    private readonly cardLinksService: CardLinksService,
    private readonly cardRegistrationService: CardRegistrationService,
    private readonly cardAdvertisingService: CardAdvertisingService,
  ) {}

  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.cardService.findByUser(+userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: Partial<CreateCardDto>) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }

  // Colores
  @Post(':id/colors')
  createColors(@Param('id') id: string, @Body() createCardColorsDto: CreateCardColorsDto) {
    return this.cardColorsService.create(createCardColorsDto);
  }

  @Get(':id/colors')
  getColors(@Param('id') id: string) {
    return this.cardColorsService.findOne(+id);
  }

  @Patch(':id/colors')
  updateColors(@Param('id') id: string, @Body() updateCardColorsDto: Partial<CreateCardColorsDto>) {
    return this.cardColorsService.update(+id, updateCardColorsDto);
  }

  // Imágenes
  @Post(':id/images')
  createImages(@Param('id') id: string, @Body() createCardImagesDto: CreateCardImagesDto) {
    return this.cardImagesService.create(createCardImagesDto);
  }

  @Get(':id/images')
  getImages(@Param('id') id: string) {
    return this.cardImagesService.findOne(+id);
  }

  @Patch(':id/images')
  updateImages(@Param('id') id: string, @Body() updateCardImagesDto: Partial<CreateCardImagesDto>) {
    return this.cardImagesService.update(+id, updateCardImagesDto);
  }

  @Post(':id/images/:type')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imagePath = await this.cardImagesService.uploadImage(file, type);
    const cardImages = await this.cardImagesService.findOne(+id);
    
    const updateDto: Partial<CreateCardImagesDto> = {};
    updateDto[type] = imagePath;
    
    return this.cardImagesService.update(+id, updateDto);
  }

  // Enlaces
  @Post(':id/links')
  createLink(@Param('id') id: string, @Body() createCardLinkDto: CreateCardLinkDto) {
    return this.cardLinksService.create(createCardLinkDto);
  }

  @Get(':id/links')
  getLinks(@Param('id') id: string) {
    return this.cardLinksService.findByCard(+id);
  }

  @Patch(':id/links/:linkId')
  updateLink(
    @Param('id') id: string,
    @Param('linkId') linkId: string,
    @Body() updateCardLinkDto: Partial<CreateCardLinkDto>,
  ) {
    return this.cardLinksService.update(+linkId, updateCardLinkDto);
  }

  @Delete(':id/links/:linkId')
  removeLink(@Param('linkId') linkId: string) {
    return this.cardLinksService.remove(+linkId);
  }

  // Página de Registro
  @Post(':id/registration')
  createRegistration(@Param('id') id: string, @Body() createCardRegistrationDto: CreateCardRegistrationDto) {
    return this.cardRegistrationService.create(createCardRegistrationDto);
  }

  @Get(':id/registration')
  getRegistration(@Param('id') id: string) {
    return this.cardRegistrationService.findByCard(+id);
  }

  @Patch(':id/registration')
  updateRegistration(
    @Param('id') id: string,
    @Body() updateCardRegistrationDto: Partial<CreateCardRegistrationDto>,
  ) {
    return this.cardRegistrationService.update(+id, updateCardRegistrationDto);
  }

  // Diseño Publicitario
  @Post(':id/advertising')
  createAdvertising(@Param('id') id: string, @Body() createCardAdvertisingDto: CreateCardAdvertisingDto) {
    return this.cardAdvertisingService.create(createCardAdvertisingDto);
  }

  @Get(':id/advertising')
  getAdvertising(@Param('id') id: string) {
    return this.cardAdvertisingService.findByCard(+id);
  }

  @Patch(':id/advertising')
  updateAdvertising(
    @Param('id') id: string,
    @Body() updateCardAdvertisingDto: Partial<CreateCardAdvertisingDto>,
  ) {
    return this.cardAdvertisingService.update(+id, updateCardAdvertisingDto);
  }
} 