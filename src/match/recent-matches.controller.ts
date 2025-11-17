import { Controller, Get } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('api/recentmatches')
export class RecentMatchesController {
  constructor(private matchService: MatchService) {}

  @Get()
  async getRecentMatches() {
    return this.matchService.getRecentMatches();
  }
}

