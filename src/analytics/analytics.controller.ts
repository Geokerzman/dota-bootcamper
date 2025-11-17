import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('api/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('compare')
  async comparePlayers(@Body() body: { accountIds: number[] }) {
    return this.analyticsService.comparePlayers(body.accountIds);
  }

  @Post('compare/save')
  @UseGuards(JwtAuthGuard)
  async saveComparison(
    @GetUser() user: any,
    @Body() body: { comparisonName: string; accountIds: number[] },
  ) {
    return this.analyticsService.saveComparison(user.id, body.comparisonName, body.accountIds);
  }

  @Get('compare/saved')
  @UseGuards(JwtAuthGuard)
  async getSavedComparisons(@GetUser() user: any) {
    return this.analyticsService.getSavedComparisons(user.id);
  }

  @Get('recommendations/:accountId')
  async getHeroRecommendations(@Param('accountId') accountId: string) {
    return this.analyticsService.getHeroRecommendations(parseInt(accountId, 10));
  }

  @Get('meta')
  async getMetaAnalysis() {
    return this.analyticsService.getMetaAnalysis();
  }

  @Post('trends/record')
  @UseGuards(JwtAuthGuard)
  async recordPerformanceTrend(
    @GetUser() user: any,
    @Body() body: { accountId: number },
  ) {
    await this.analyticsService.recordPerformanceTrend(user.id, body.accountId);
    return { message: 'Performance trend recorded' };
  }

  @Get('trends/:accountId')
  @UseGuards(JwtAuthGuard)
  async getPerformanceTrends(
    @GetUser() user: any,
    @Param('accountId') accountId: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getPerformanceTrends(
      user.id,
      parseInt(accountId, 10),
      days ? parseInt(days, 10) : 30,
    );
  }
}

