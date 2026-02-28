import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MatchField } from '../../../../../shared/decorators/match-field.decorator';
import { Role } from '../../../../auth/domain/role.enum';

export class CreateUserRequestDto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ format: 'email' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 25, description: 'Strong password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(25)
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    minLength: 8,
    maxLength: 25,
    description: 'Must match password',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(25)
  @MatchField('password', { message: 'Passwords do not match' })
  confirmPassword: string;

  @ApiProperty({ enum: Role })
  @IsString()
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
