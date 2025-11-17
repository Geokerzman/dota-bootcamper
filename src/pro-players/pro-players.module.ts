import { Module } from '@nestjs/common';
import { ProPlayersController } from './pro-players.controller';
import { ProPlayersService } from './pro-players.service';
import { OpenDotaService } from '../services/open-dota.service';

@Module({
  controllers: [ProPlayersController],
  providers: [ProPlayersService, OpenDotaService],
})
export class ProPlayersModule {}

