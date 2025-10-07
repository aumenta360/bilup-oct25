import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CustomFieldDto {
  @IsString()
  name: string;

  @IsString()
  type: 'dropdown' | 'text' | 'number' | 'date';

  @IsArray()
  @IsOptional()
  options?: string[];

  @IsBoolean()
  required: boolean;
}

export class CreateCardRegistrationDto {
  @IsString()
  pageName: string;

  @IsString()
  @IsOptional()
  circularLogo?: string;

  @IsBoolean()
  @IsOptional()
  showName?: boolean;

  @IsBoolean()
  @IsOptional()
  showLastName?: boolean;

  @IsBoolean()
  @IsOptional()
  showEmail?: boolean;

  @IsBoolean()
  @IsOptional()
  showPhone?: boolean;

  @IsBoolean()
  @IsOptional()
  showBirthday?: boolean;

  @IsBoolean()
  @IsOptional()
  showGender?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomFieldDto)
  @IsOptional()
  customFields?: CustomFieldDto[];
} 