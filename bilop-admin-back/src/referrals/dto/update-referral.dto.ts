import { IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateReferralDto {
  @IsOptional()
  @IsBoolean()
  registered?: boolean;

  @IsOptional()
  @IsNumber()
  registeredUserId?: number;
} 