import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const getSslConfig = () => {
  if (process.env.DATABASE_SSL !== 'true') {
    return false;
  }

  const certPath = path.resolve(process.cwd(), 'prod-ca-2021.crt');

  // 校验证书是否存在，存在则开启严格校验，不存在则降级或抛出明确错误
  if (fs.existsSync(certPath)) {
    return {
      rejectUnauthorized: true, // 开启严格 CA 校验，发挥 SSL 证书安全效用
      ca: fs.readFileSync(certPath).toString(),
    };
  }

  // 如果生产环境没有找到证书，退回到仅加密传输模式
  return {
    rejectUnauthorized: false,
  };
};

export default registerAs('databaseconfig', () => ({
  type: 'postgres',
  port: Number(process.env.DATABASE_PORT) || 5432,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  ssl: getSslConfig(),
}));
