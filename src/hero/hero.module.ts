import { Module } from '@nestjs/common';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';
import { OpenDotaService } from '../services/open-dota.service';

@Module({
  controllers: [HeroController],
  providers: [HeroService, OpenDotaService],
})
export class HeroModule {}

