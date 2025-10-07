import { IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateReferralDto {
  @IsNumber()
  @IsNotEmpty()
  referrerId: number;

  @IsEmail()
  @IsNotEmpty()
  referredEmail: string;
} 