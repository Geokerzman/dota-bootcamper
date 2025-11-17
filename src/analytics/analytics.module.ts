import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { OpenDotaService } from '../services/open-dota.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, OpenDotaService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}

