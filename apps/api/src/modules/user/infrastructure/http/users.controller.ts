import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserRequestDto } from './dtos/request.dto';
import { UserQueryDto } from './dtos/user-query.dto';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { SetUserActiveRequestDto } from './dtos/set-user-active.dto';
import { SetUserActiveUseCase } from '../../application/use-cases/set-user-active.use-case';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../../auth/domain/role.enum';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../../../shared/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly setUserActiveUseCase: SetUserActiveUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateUserRequestDto) {
    return this.createUser.execute(body);
  }

  @Get()
  async getUsers(@Query() query: UserQueryDto) {
    return this.getUsersUseCase.execute(query);
  }

  @Patch(':id/active')
  async setUserActive(
    @Param('id') id: string,
    @Body() body: SetUserActiveRequestDto,
  ) {
    return this.setUserActiveUseCase.execute(id, body.isActive);
  }
}
