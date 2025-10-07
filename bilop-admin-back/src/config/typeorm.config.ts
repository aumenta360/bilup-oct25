import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USERNAME = 'bilopapp_user',
  DB_PASSWORD = '1234',
  DB_DATABASE = 'bilopapp'
} = process.env;

export default new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false
}); 