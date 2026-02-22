import { Inject } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../domain/repositories/user.repository';

export class SetUserActiveUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, isActive: boolean): Promise<void> {
    await this.userRepository.setActive(id, isActive);
  }
}
