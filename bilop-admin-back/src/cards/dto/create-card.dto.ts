import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCardColorsDto } from './create-card-colors.dto';
import { CreateCardImagesDto } from './create-card-images.dto';
import { CreateCardRegistrationDto } from './create-card-registration.dto';
import { CreateCardAdvertisingDto } from './create-card-advertising.dto';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  primaryColor: string;

  @IsString()
  @IsNotEmpty()
  secondaryColor: string;

  @IsString()
  @IsNotEmpty()
  backgroundColor: string;

  @IsString()
  @IsOptional()
  style?: string;

  @IsString()
  @IsOptional()
  displayType?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ValidateNested()
  @Type(() => CreateCardColorsDto)
  colors: CreateCardColorsDto;

  @ValidateNested()
  @Type(() => CreateCardImagesDto)
  @IsOptional()
  images?: CreateCardImagesDto;

  @ValidateNested()
  @Type(() => CreateCardRegistrationDto)
  @IsOptional()
  registration?: CreateCardRegistrationDto;

  @ValidateNested()
  @Type(() => CreateCardAdvertisingDto)
  @IsOptional()
  advertising?: CreateCardAdvertisingDto;
} 