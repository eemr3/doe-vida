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
  @IsDate()
  lastDonationDate?: Date;

  @IsOptional()
  @IsString()
  lastDonationLocation?: string;
}
