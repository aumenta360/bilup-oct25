import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCardAdvertisingDto {
  @IsString()
  templateName: string;

  @IsString()
  @IsOptional()
  promotionalImage?: string;

  @IsString()
  @IsOptional()
  promotionalText?: string;

  @IsBoolean()
  @IsOptional()
  includeQR?: boolean;

  @IsString()
  @IsOptional()
  customBackground?: string;

  @IsString()
  @IsOptional()
  customFont?: string;
} 