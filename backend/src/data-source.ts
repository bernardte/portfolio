import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 提取 SSL 配置函数，与 database.config.ts 保持 100% 一致
 */
const getSslConfig = () => {
  if (process.env.DATABASE_SSL !== 'true') {
    return false;
  }

  const certPath = path.resolve(process.cwd(), 'prod-ca-2021.crt');

  // 校验证书是否存在：存在则开启 CA 严格校验，不存在则退回常规加密
  if (fs.existsSync(certPath)) {
    return {
      rejectUnauthorized: true,
      ca: fs.readFileSync(certPath).toString(),
    };
  }

  return {
    rejectUnauthorized: false,
  };
};

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl: getSslConfig(),
});
