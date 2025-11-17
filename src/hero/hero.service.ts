import { Injectable } from '@nestjs/common';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class HeroService {
  constructor(private openDotaService: OpenDotaService) {}

  async getHeroes() {
    const heroes = await this.openDotaService.getHeroes();

    if (!Array.isArray(heroes)) {
      throw new Error('Unexpected response format from OpenDota API');
    }

    const heroesInfo = heroes.map((hero) => ({
      id: hero.id,
      name: hero.name,
      localized_name: hero.localized_name,
      primary_attr: hero.primary_attr,
      attack_type: hero.attack_type,
      roles: hero.roles,
    }));

    return heroesInfo;
  }
}

