import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsString, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  birthdate?: Date;

  @IsOptional()
  gender?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}