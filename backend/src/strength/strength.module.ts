import { Module } from '@nestjs/common';
import { StrengthService } from './strength.service';
import { StrengthController } from './strength.controller';
import { ProfileModule } from '../profile/profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Strength } from './entities/strength.entity';
import { FileManagerModule } from '../file-manager/file-manager.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Strength]),
    ProfileModule,
    FileManagerModule,
    AuthModule,
  ],
  controllers: [StrengthController],
  providers: [StrengthService],
  exports: [StrengthService],
})
export class StrengthModule {}
