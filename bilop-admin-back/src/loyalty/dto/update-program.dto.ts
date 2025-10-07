import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, Length, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TermsAndConditionsDto {
  @IsString()
  @Length(10, 5000)
  content: string;
}

class UsageLimitsDto {
  @IsBoolean()
  enabled: boolean;

  @IsString()
  period: 'day' | 'week' | 'month';

  @IsNumber()
  @Min(1)
  @Max(100)
  maxUses: number;
}

class ExpirationConfigDto {
  @IsBoolean()
  enabled: boolean;

  @IsString()
  type: 'days' | 'weeks' | 'months' | 'years';

  @IsNumber()
  @Min(1)
  @Max(365)
  value: number;
}

export class UpdateProgramDto {
  @IsString()
  @Length(3, 40)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(10, 500)
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  pointsPerPurchase?: number;

  @IsNumber()
  @Min(4)
  @Max(20)
  @IsOptional()
  requiredStamps?: number;

  @IsString()
  @Length(3, 200)
  @IsOptional()
  reward?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @Length(7, 7)
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @Length(7, 7)
  @IsOptional()
  textColor?: string;

  @IsString()
  @Length(7, 7)
  @IsOptional()
  secondaryColor?: string;

  @IsString()
  @IsOptional()
  stampImage?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => TermsAndConditionsDto)
  termsAndConditions?: TermsAndConditionsDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => UsageLimitsDto)
  usageLimits?: UsageLimitsDto;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ExpirationConfigDto)
  expirationConfig?: ExpirationConfigDto;
} 