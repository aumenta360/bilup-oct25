import { IsEmail, IsOptional, MinLength, IsString, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  birthdate?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}