import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { OpenDotaService } from '../services/open-dota.service';

@Module({
  controllers: [LeaderboardController],
  providers: [LeaderboardService, OpenDotaService],
})
export class LeaderboardModule {}

