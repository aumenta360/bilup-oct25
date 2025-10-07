import { IsString, Length, IsOptional, IsArray, IsInt, Min, Max, IsDateString } from 'class-validator';

export class CreatePushMessageDto {
  @IsString()
  @Length(1, 40)
  title: string;

  @IsString()
  @Length(1, 120)
  message: string;

  @IsArray()
  @IsOptional()
  origins?: string[]; // códigos de share-link o "Todos"

  @IsInt()
  @Min(0)
  @IsOptional()
  exactStamps?: number;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string; // ISO string, máximo 30 días futuro
} 