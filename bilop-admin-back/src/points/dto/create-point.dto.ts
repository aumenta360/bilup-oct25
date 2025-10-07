import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePointDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  pointTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}