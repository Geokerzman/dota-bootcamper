import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SteamService } from './steam.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('api/steam')
export class SteamController {
  constructor(private steamService: SteamService) {}

  @Post('link')
  @UseGuards(JwtAuthGuard)
  async linkSteam(@Body() body: { steamid: string }, @GetUser() user: any) {
    return this.steamService.linkSteam(body.steamid, user.id);
  }
}

