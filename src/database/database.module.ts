import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { PlayerCache } from '../models/player-cache.model';
import { Library } from '../models/library.model';
import { PlayerComparison } from '../models/player-comparison.model';
import { Alert } from '../models/alert.model';
import { PerformanceTrend } from '../models/performance-trend.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      PlayerCache,
      Library,
      PlayerComparison,
      Alert,
      PerformanceTrend,
    ]),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}

