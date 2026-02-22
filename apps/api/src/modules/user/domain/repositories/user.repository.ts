import { Role } from '../../../auth/domain/role.enum';
import { UserResponseDto } from '../../infrastructure/http/dtos/user.dto';
import { RoleEntity } from '../entities/role.entiry';
import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  role?: Role;
  status?: boolean;
}
export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(query: UserQuery): Promise<UserResponseDto>;
  createRole(role: RoleEntity): Promise<RoleEntity>;
  setActive(id: string, isActive: boolean): Promise<void>;
}
