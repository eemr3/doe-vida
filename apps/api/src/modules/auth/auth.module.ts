import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';
import { UserModule } from '../user/users.module';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { AuthController } from './infrastructure/http/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtGuard } from './infrastructure/guards/jwt.guard';

@Module({
  imports: [JwtModule.register(jwtConfig), UserModule],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy, JwtGuard],
  exports: [JwtGuard, JwtStrategy],
})
export class AuthModule {}
