import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config({ path: '.env.docker' });

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}', 'src/**/*.entity{.ts,.js}'],
  migrations: ['migrations/**'],
  ssl: process.env.NODE_ENV == 'production' ? true : false,
});
