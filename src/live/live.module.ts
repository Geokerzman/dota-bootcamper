import { Module } from '@nestjs/common';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';
import { OpenDotaService } from '../services/open-dota.service';

@Module({
  controllers: [LiveController],
  providers: [LiveService, OpenDotaService],
})
export class LiveModule {}

