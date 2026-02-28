import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../../auth/domain/role.enum';

export class UserQueryDto {
  @ApiPropertyOptional({
    description: 'Search term for name or email',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: Role,
    description: 'Filter by role',
    required: false,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    required: false,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Page number',
    required: false,
    example: '1',
  })
  @IsOptional()
  @IsString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Page size',
    required: false,
    example: '10',
  })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
