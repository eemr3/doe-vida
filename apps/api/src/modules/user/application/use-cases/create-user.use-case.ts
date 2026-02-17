import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repository/user.repository';
import { ConflictError } from '../../../../shared/exceptions/conflict.error';
import { RoleEntity } from '../../domain/entities/role.entiry';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { Role } from '../../../auth/domain/role.enum';

export class CreateUserUseCase {
  private readonly PASSWORD_SALT_ROUNDS = 10;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) {
    const roleNeme = data.role;
    const hashedPassword = await bcrypt.hash(
      data.password,
      this.PASSWORD_SALT_ROUNDS,
    );

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('User already exists');
    }

    const role = await this.userRepository.createRole(
      new RoleEntity(randomUUID(), Role[roleNeme]),
    );

    const user = new UserEntity(
      randomUUID(),
      data.name,
      data.email,
      hashedPassword,
      role,
    );

    user.activate();
    return UserMapper.toResponse(await this.userRepository.create(user));
  }
}
