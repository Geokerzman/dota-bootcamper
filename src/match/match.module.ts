import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchDetailController } from './match-detail.controller';
import { MatchSummaryController } from './match-summary.controller';
import { RecentMatchesController } from './recent-matches.controller';
import { RecentProMatchesController } from './recent-pro-matches.controller';
import { MatchService } from './match.service';
import { OpenDotaService } from '../services/open-dota.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [
    MatchController,
    MatchDetailController,
    MatchSummaryController,
    RecentMatchesController,
    RecentProMatchesController,
  ],
  providers: [MatchService, OpenDotaService],
})
export class MatchModule {}

