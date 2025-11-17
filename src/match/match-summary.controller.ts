import { Controller, Get, Param } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('api/match')
export class MatchSummaryController {
  constructor(private matchService: MatchService) {}

  @Get(':match_id')
  async getMatchSummary(@Param('match_id') matchId: string) {
    return this.matchService.getMatchData(matchId);
  }
}

