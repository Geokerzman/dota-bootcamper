import { HeroService } from './hero.service';
export declare class HeroController {
    private heroService;
    constructor(heroService: HeroService);
    getHeroes(): Promise<{
        id: any;
        name: any;
        localized_name: any;
        primary_attr: any;
        attack_type: any;
        roles: any;
    }[]>;
}
