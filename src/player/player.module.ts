import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { OpenDotaService } from '../services/open-dota.service';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService, OpenDotaService],
})
export class PlayerModule {}

