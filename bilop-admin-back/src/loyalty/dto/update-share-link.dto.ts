import { IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class UpdateShareLinkDto {
  @IsString()
  @Length(3, 40)
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
} 