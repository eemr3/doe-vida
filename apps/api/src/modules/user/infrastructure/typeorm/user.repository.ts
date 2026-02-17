import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../../domain/repository/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserOrmEntity } from './user.orm-entity';
import { RoleEntity } from '../../domain/entities/role.entiry';
import { RoleOrmEntity } from './role.orm-entity';
import { randomUUID } from 'crypto';
import { Role } from '../../../auth/domain/role.enum';

export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepo: Repository<RoleOrmEntity>,
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const ormUser = new UserOrmEntity();
    ormUser.id = user.id;
    ormUser.name = user.name;
    ormUser.email = user.email;
    ormUser.isActive = user.isActive;
    ormUser.password = user.password;

    const ormRole = new RoleOrmEntity();
    ormRole.id = user.role.id;
    ormRole.name = user.role.name;
    ormUser.role = ormRole;

    await this.repo.save(ormUser);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const entity = await this.repo.findOne({ where: { email } });
    return entity
      ? new UserEntity(
          entity.id,
          entity.name,
          entity.email,
          entity.password,
          new RoleEntity(entity.role.id, Role[entity.role.name]),
          entity.isActive,
        )
      : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const entity = await this.repo.findOne({ where: { id } });
    return entity
      ? new UserEntity(
          entity.id,
          entity.name,
          entity.email,
          entity.password,
          new RoleEntity(entity.role.id, Role[entity.role.name]),
          entity.isActive,
        )
      : null;
  }

  async createRole(roleRequest: RoleEntity): Promise<RoleEntity> {
    const role = new RoleOrmEntity();
    role.id = randomUUID();
    role.name = roleRequest.name;
    const roleOrm = await this.roleRepo.save(role);
    return new RoleEntity(roleOrm.id, Role[roleOrm.name]);
  }
}
