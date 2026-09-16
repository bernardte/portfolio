import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller.js';
import { CloudinaryHealthIndicator } from './Indicators/cloudinary-health.validator.js';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [CloudinaryHealthIndicator],
})
export class HealthModule {}
