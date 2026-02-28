import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { UserModule } from '../user/users.module';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { JwtGuard } from './infrastructure/guards/jwt.guard';
import { AuthController } from './infrastructure/http/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>(
            'auth.jwtExpiresIn',
          ) as StringValue,
        },
      }),
      inject: [ConfigService],
    }),

    UserModule,
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy, JwtGuard],
  exports: [JwtGuard, JwtStrategy],
})
export class AuthModule {}
