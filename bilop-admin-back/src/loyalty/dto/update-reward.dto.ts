import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, Length } from 'class-validator';

export class UpdateRewardDto {
  @IsString()
  @Length(3, 40)
  @IsOptional()
  title?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  requiredStamps?: number;

  @IsNumber()
  @Min(0)
  @Max(365)
  @IsOptional()
  expirationDays?: number;

  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;

  @IsString()
  @Length(3, 200)
  @IsOptional()
  redemptionNote?: string;
} 