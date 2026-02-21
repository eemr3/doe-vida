import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BloodType } from '../../../domain/enum/boodtype.enum';
import { Type } from 'class-transformer';
import { GenderType } from '../../../domain/enum/Gender-type.enum';

export class RegisterDonorRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(BloodType)
  @IsNotEmpty()
  bloodType: BloodType;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsOptional()
  @IsString()
  lastDonationDate?: string;

  @IsOptional()
  @IsString()
  lastDonationLocation?: string;
}
