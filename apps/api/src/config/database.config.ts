import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const getTypeOrmConfig = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.postgres.host'),
  port: configService.get<number>('database.postgres.port'),
  username: configService.get<string>('database.postgres.username'),
  password: configService.get<string>('database.postgres.password'),
  database: configService.get<string>('database.postgres.name'),
  entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
  migrations: [__dirname + '/../shared/database/migrations/*{.ts,.js}'],
  synchronize: false,
});
