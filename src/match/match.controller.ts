import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('api/matches')
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMatches(@GetUser() user: any) {
    return this.matchService.getMatchHistory(user.id);
  }
}

