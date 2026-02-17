import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { LoginRequestDto } from './dtos/request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body() body: LoginRequestDto) {
    return this.loginUseCase.execute(body);
  }
}
