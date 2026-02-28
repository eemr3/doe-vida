import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BloodType } from '../../../domain/enum/boodtype.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DonorQueryDto {
  @ApiPropertyOptional({
    required: false,
    description: 'Search term for donor name or other attributes',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Filter by donor city',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    required: false,
    enum: BloodType,
    description: 'Filter by blood type',
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @ApiPropertyOptional({
    required: false,
    description: 'Whether donor is currently eligible for donation',
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsOptional()
  eligible?: boolean;

  @ApiPropertyOptional({
    required: false,
    description: 'Page number for pagination',
    example: '1',
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    required: false,
    description: 'Page size for pagination',
    example: '10',
  })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
