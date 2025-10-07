import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, Length } from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @Length(3, 40)
  title: string;

  @IsNumber()
  @Min(1)
  requiredStamps: number;

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