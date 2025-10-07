import { IsString, IsOptional } from 'class-validator';

export class CreateCardColorsDto {
  @IsString()
  primaryColor: string;

  @IsString()
  secondaryColor: string;

  @IsString()
  backgroundColor: string;

  @IsString()
  @IsOptional()
  accentColor?: string;

  @IsString()
  @IsOptional()
  textColor?: string;
} 