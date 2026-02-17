import { Inject } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repository/user.repository';

export class FindByEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }
}
