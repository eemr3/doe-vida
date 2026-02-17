import { Role } from '../../../auth/domain/role.enum';

export class RoleEntity {
  constructor(
    public readonly id: string,
    public name: Role,
  ) {}
}
