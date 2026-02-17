import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MatchField } from '../../../../../shared/decorators/match-field.decorator';
import { Role } from '../../../../auth/domain/role.enum';

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(25)
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(25)
  @MatchField('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
