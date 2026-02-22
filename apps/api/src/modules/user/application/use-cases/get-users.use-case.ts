import { Inject } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
  UserQuery,
} from '../../domain/repositories/user.repository';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserMapper } from '../mappers/user.mapper';

export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: UserQuery): Promise<UserResponseDto> {
    const users = await this.userRepository.findAll(query);
    return {
      items: users.items.map(UserMapper.toResponse),
      totalCount: users.totalCount,
    };
  }
}
