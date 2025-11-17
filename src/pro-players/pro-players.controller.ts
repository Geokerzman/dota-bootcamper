import { Controller, Get } from '@nestjs/common';
import { ProPlayersService } from './pro-players.service';

@Controller('api/proplayers')
export class ProPlayersController {
  constructor(private proPlayersService: ProPlayersService) {}

  @Get()
  async getProPlayers() {
    return this.proPlayersService.getProPlayers();
  }
}

