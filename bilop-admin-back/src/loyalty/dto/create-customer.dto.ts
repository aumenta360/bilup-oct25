import { IsString, IsEmail, IsOptional, Length, IsDateString, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @Length(2, 40)
  firstName: string;

  @IsString()
  @Length(2, 40)
  lastName: string;

  @IsString()
  @Length(8, 20)
  phone: string;

  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsDateString()
  @IsOptional()
  birthdate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  origin: string;
} 