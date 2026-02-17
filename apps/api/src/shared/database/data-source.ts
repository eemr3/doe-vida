import 'dotenv/config'; // To load environment variables
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { cwd } from 'process';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres', // or 'mysql', 'sqlite', etc.
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(cwd(), '**/*.orm-entity.ts')],
  migrations: ['src/shared/database/migrations/*.ts'],
  synchronize: false, // Essential for production
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
