import { Controller, Get, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('api/playerinfo')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get()
  async getPlayerInfo(@Query('account_id') accountId: string) {
    if (!accountId) {
      throw new BadRequestException('Account ID is required');
    }

    return this.playerService.getPlayerInfo(accountId);
  }

  @Get('totals')
  async getTotals(@Query('account_id') accountId: string, @Query() query: any) {
    if (!accountId) {
      throw new BadRequestException('Account ID is required');
    }

    return this.playerService.getTotals(accountId, query);
  }

  @Get('counts')
  async getCounts(@Query('account_id') accountId: string, @Query() query: any) {
    if (!accountId) {
      throw new BadRequestException('Account ID is required');
    }

    return this.playerService.getCounts(accountId, query);
  }

  @Get('search')
  async searchPlayers(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Search query (q) is required');
    }

    return this.playerService.searchPlayers(query);
  }

  @Get('histograms')
  async getHistograms(@Query('account_id') accountId: string, @Query('field') field: string, @Query() query: any) {
    if (!accountId || !field) {
      throw new BadRequestException('Account ID and field are required');
    }

    return this.playerService.getHistograms(accountId, field, query);
  }

  @Get('overview')
  async getOverview(@Query('account_id') accountId: string) {
    if (!accountId) {
      throw new BadRequestException('Account ID is required');
    }

    return this.playerService.getOverview(accountId);
  }
}

