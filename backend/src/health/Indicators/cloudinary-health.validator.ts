import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryHealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // 调用 Cloudinary SDK 验证 API 连接与凭证
      const result = await cloudinary.api.ping();
      const isUp = result?.status === 'ok';

      if (isUp) {
        return {
          [key]: {
            status: 'up',
          },
        };
      }

      throw new ServiceUnavailableException({
        [key]: {
          status: 'down',
          message: 'Cloudinary ping returned non-ok status',
        },
      });
    } catch (error) {
      // 捕获异常并抛出 503 异常，Terminus 会捕获并标记该项为 down
      throw new ServiceUnavailableException({
        [key]: {
          status: 'down',
          message:
            error instanceof Error ? error.message : 'Cloudinary check failed',
        },
      });
    }
  }
}
