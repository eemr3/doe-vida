import { UserEntity } from '../../domain/entities/user.entity';
import { UserItem } from '../dtos/user-response.dto';

export class UserMapper {
  static toResponse(user: UserEntity): UserItem {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
    };
  }
}
