import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import envConfig from './config/env.config';
import { validateEnv } from './config/env.validation';
import { DatabaseModule } from './infrastructure/database/postgres/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { DonorModule } from './modules/donor/donor.module';
import { UserModule } from './modules/user/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
      validate: (config) => validateEnv(config) as ReturnType<typeof envConfig>,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    DonorModule,
  ],
})
export class AppModule {}
