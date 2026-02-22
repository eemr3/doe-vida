import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './infrastructure/http/users.controller';
import { UserOrmEntity } from './infrastructure/typeorm/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/typeorm/user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { FindByEmailUseCase } from './application/use-cases/find-by-email.use-case';
import { RoleOrmEntity } from './infrastructure/typeorm/role.orm-entity';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { SetUserActiveUseCase } from './application/use-cases/set-user-active.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, RoleOrmEntity])],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    FindByEmailUseCase,
    GetUsersUseCase,
    SetUserActiveUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
