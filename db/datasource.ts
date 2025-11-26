import * as path from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'thelab_erp',
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, '../src/core/entities/*.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/*.{ts,js}')],
  subscribers: [],
});
