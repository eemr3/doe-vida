import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.orm-entity{.ts,.js}'],
  migrations: [__dirname + '/../shared/database/migrations/*{.ts,.js}'],
  synchronize: false,
};
