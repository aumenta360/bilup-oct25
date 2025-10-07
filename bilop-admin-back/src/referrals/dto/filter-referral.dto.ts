import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReferralStatus {
  PENDING = 'PENDING',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED',
  REJECTED = 'REJECTED'
}

export class FilterReferralDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(ReferralStatus)
  status?: ReferralStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  referrerId?: number;
} 