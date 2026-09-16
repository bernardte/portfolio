import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { CloudinaryHealthIndicator } from './Indicators/cloudinary-health.validator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private cloudinaryHealth: CloudinaryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      // 1.检查数据库连通性
      () => this.db.pingCheck('database', { timeout: 1000 }),

      // 检测 Cloudinary CDN/API 服务连通性
      () => this.cloudinaryHealth.isHealthy('cloudinary'),
    ]);
  }
}
