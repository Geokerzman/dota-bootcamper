import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/matchdetails')
export class MatchDetailController {
  constructor(private matchService: MatchService) {}

  @Get(':match_id')
  @UseGuards(JwtAuthGuard)
  async getMatchDetails(@Param('match_id') matchId: string) {
    return this.matchService.getMatchDetails(matchId);
  }
}

