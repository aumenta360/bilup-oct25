import { IsString, IsEmail, IsOptional, Length, IsDateString, MaxLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsString()
  @Length(2, 40)
  @IsOptional()
  firstName?: string;

  @IsString()
  @Length(2, 40)
  @IsOptional()
  lastName?: string;

  @IsString()
  @Length(8, 20)
  @IsOptional()
  phone?: string;

  @IsEmail()
  @Length(5, 100)
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsOptional()
  birthdate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  origin?: string;
} 