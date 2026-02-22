import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../../auth/domain/role.enum';
import { Transform } from 'class-transformer';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsOptional()
  status?: boolean;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  pageSize?: string;
}
