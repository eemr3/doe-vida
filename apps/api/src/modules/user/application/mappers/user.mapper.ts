import { UserEntity } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

export class UserMapper {
  static toResponse(user: UserEntity): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
    };
  }
}
