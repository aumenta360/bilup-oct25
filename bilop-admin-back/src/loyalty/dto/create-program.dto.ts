import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, Length, IsObject, ValidateNested, Matches, IsArray } from 'class-validator';
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

export class CreateProgramDto {
  @IsString()
  @Length(3, 40)
  name: string;

  @IsString()
  @Length(10, 500)
  description: string;

  @IsString()
  @IsOptional()
  type?: string;

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

  @IsNumber()
@Min(0)
@IsOptional()
preFilledStamps?: number;

@IsString()
@IsOptional()
onCompleteBehavior?: 'unlimited' | 'limit' | 'reset';

@IsString()
@IsOptional()
customStampIcon?: string;

  @IsString()
  @Length(3, 200)
  @IsOptional()
  reward?: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  @IsOptional()
  primaryColor?: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  @IsOptional()
  textColor?: string;

  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  @IsOptional()
  secondaryColor?: string;

  @IsString()
  @Matches(/^data:image\/(png|jpeg|jpg);base64,/)
  @Length(0, 300000) // 300KB
  @IsOptional()
  logoImage?: string;

  @IsString()
  @Matches(/^data:image\/(png|jpeg|jpg);base64,/)
  @Length(0, 1000000) // 1MB
  @IsOptional()
  backgroundImage?: string;

  @IsString()
  @Matches(/^data:image\/(png|jpeg|jpg);base64,/)
  @Length(0, 300000) // 300KB
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

  @IsArray()
  rewards: any[];
} 