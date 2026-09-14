import { registerAs } from "@nestjs/config";

export default registerAs('databaseconfig', () => ({
  type: 'postgres',
  port: Number(process.env.DATABASE_PORT),
  host: process.env.DATABASE_HOST,
  username: 'postgres' as const,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  ssl:
    process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
}));