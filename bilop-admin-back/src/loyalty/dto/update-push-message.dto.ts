import { IsString, Length, IsOptional, IsArray, IsInt, Min, IsDateString } from 'class-validator';

export class UpdatePushMessageDto {
  @IsString()
  @Length(1, 40)
  @IsOptional()
  title?: string;

  @IsString()
  @Length(1, 120)
  @IsOptional()
  message?: string;

  @IsArray()
  @IsOptional()
  origins?: string[];

  @IsInt()
  @Min(0)
  @IsOptional()
  exactStamps?: number;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
} 