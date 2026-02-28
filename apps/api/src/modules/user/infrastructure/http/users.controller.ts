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
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { SetUserActiveRequestDto } from './dtos/set-user-active.dto';
import { SetUserActiveUseCase } from '../../application/use-cases/set-user-active.use-case';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../../auth/domain/role.enum';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly setUserActiveUseCase: SetUserActiveUseCase,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() body: CreateUserRequestDto) {
    return this.createUser.execute(body);
  }

  @Get()
  @ApiOkResponse({
    description: 'Paginated list of users',
    type: UserResponseDto,
  })
  async getUsers(@Query() query: UserQueryDto) {
    return this.getUsersUseCase.execute(query);
  }

  @Patch(':id/active')
  @ApiOkResponse({
    description: 'User active status updated',
    type: UserResponseDto,
  })
  async setUserActive(
    @Param('id') id: string,
    @Body() body: SetUserActiveRequestDto,
  ) {
    return this.setUserActiveUseCase.execute(id, body.isActive);
  }
}
