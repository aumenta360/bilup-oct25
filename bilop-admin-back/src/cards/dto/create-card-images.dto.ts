import { IsString, IsOptional } from 'class-validator';

export class CreateCardImagesDto {
  @IsString()
  @IsOptional()
  squareLogo?: string;

  @IsString()
  @IsOptional()
  horizontalLogo?: string;

  @IsString()
  @IsOptional()
  cardCoverImage?: string;

  @IsString()
  @IsOptional()
  registrationPageMobileImage?: string;

  @IsString()
  @IsOptional()
  registrationPageDesktopImage?: string;

  @IsString()
  @IsOptional()
  promotionalImage?: string;
} 