import { Inject } from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../user/domain/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from '../../../../shared/exceptions/unauthorized.error';

export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }
    if (user.isActive === false) {
      throw new UnauthorizedError('User is not active');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
