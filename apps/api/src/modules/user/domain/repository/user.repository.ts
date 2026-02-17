import { RoleEntity } from "../entities/role.entiry";
import { UserEntity } from "../entities/user.entity";

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  createRole(role: RoleEntity): Promise<RoleEntity>;
}
