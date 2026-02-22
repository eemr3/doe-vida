import { Role } from '../../../../auth/domain/role.enum';
import { RoleEntity } from '../../../domain/entities/role.entiry';

export class UserItem {
  id: string;
  name: string;
  email: string;
  password: string;
  role: RoleEntity;
  isActive: boolean;
}
export interface UserResponseDto {
  items: UserItem[];
  totalCount: number;
}
