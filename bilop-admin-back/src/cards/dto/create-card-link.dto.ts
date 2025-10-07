import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCardLinkDto {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 