import 'dotenv/config';
import { DataSource } from 'typeorm';
const dataSource: DataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '1',
  database: process.env.DB_NAME || 'my-admin',
  entities: ['dist/entities/*.entity{.ts,.js}'],
  subscribers: ['dist/**/*.subscriber{ .ts,.js }'],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: true,
});
export default dataSource;
