import { Controller, Get } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('api/recentpromatches')
export class RecentProMatchesController {
  constructor(private matchService: MatchService) {}

  @Get()
  async getRecentProMatches() {
    return this.matchService.getRecentProMatches();
  }
}

