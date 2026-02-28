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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDonorRequestDto {
  @ApiProperty({
    description: 'Full name of the donor',
    example: 'Maria Silva',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Email address', example: 'maria@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+5511999999999' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Date of birth',
    type: String,
    format: 'date-time',
    example: '1990-05-20T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'Gender of the donor',
    enum: GenderType,
    example: GenderType.FEMALE,
  })
  @IsEnum(GenderType)
  @IsNotEmpty()
  gender: GenderType;

  @ApiProperty({ description: 'City where donor lives', example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Blood type of the donor',
    enum: BloodType,
    example: BloodType.APositive,
  })
  @IsEnum(BloodType)
  @IsNotEmpty()
  bloodType: BloodType;

  @ApiProperty({ description: 'Weight in kilograms', example: 68 })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiPropertyOptional({
    description: 'Date of last donation (if any)',
    type: String,
    format: 'date-time',
    example: '2024-01-15T00:00:00.000Z',
  })
  @IsOptional()
  @IsString()
  lastDonationDate?: string;

  @ApiPropertyOptional({
    description: 'Location of last donation',
    example: 'Hospital das Clínicas',
  })
  @IsOptional()
  @IsString()
  lastDonationLocation?: string;
}
