import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { OpenDotaService } from '../services/open-dota.service';

@Injectable()
export class HeroService {
  private readonly logger = new Logger(HeroService.name);

  constructor(private openDotaService: OpenDotaService) {}

  async getHeroes() {
    this.logger.debug('Fetching heroes list');
    try {
      const heroes = await this.openDotaService.getHeroes();

      if (!Array.isArray(heroes)) {
        throw new BadRequestException('Unexpected response format from OpenDota API');
      }

      const heroesInfo = heroes.map((hero) => ({
        id: hero.id,
        name: hero.name,
        img: hero.img,
        icon: hero.icon,
        localized_name: hero.localized_name,
        primary_attr: hero.primary_attr,
        attack_type: hero.attack_type,
        roles: hero.roles,
      }));

      this.logger.debug(`Retrieved ${heroesInfo.length} heroes`);
      return heroesInfo;
    } catch (error) {
      this.logger.error(`Failed to fetch heroes: ${error.message}`);
      throw error;
    }
  }
}

