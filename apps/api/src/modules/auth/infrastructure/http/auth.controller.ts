import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { LoginRequestDto } from './dtos/request.dto';
import { LoginResponseDto } from './dtos/response.dto';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @ApiTags('Auth')
  @Post('login')
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'JWT token and user information',
  })
  async login(@Body() body: LoginRequestDto) {
    return this.loginUseCase.execute(body);
  }
}
