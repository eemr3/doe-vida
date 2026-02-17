import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserRequestDto } from './dtos/request.dto';

@Controller('users')
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserRequestDto) {
    return this.createUser.execute(body);
  }
}
