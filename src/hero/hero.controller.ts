import { Controller, Get } from '@nestjs/common';
import { HeroService } from './hero.service';

@Controller('api/heroes')
export class HeroController {
  constructor(private heroService: HeroService) {}

  @Get()
  async getHeroes() {
    return this.heroService.getHeroes();
  }
}

