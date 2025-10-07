import { IsString, Length } from 'class-validator';
 
export class CreateShareLinkDto {
  @IsString()
  @Length(3, 40)
  name: string;
} 