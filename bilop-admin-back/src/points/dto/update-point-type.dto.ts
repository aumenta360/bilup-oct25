import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePointTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  value?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}