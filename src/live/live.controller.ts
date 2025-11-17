import { Controller, Get } from '@nestjs/common';
import { LiveService } from './live.service';

@Controller('api/live')
export class LiveController {
  constructor(private liveService: LiveService) {}

  @Get()
  async getLiveGames() {
    return this.liveService.getLiveGames();
  }
}

