import { OpenDotaService } from '../services/open-dota.service';
export declare class HeroService {
    private openDotaService;
    private readonly logger;
    constructor(openDotaService: OpenDotaService);
    getHeroes(): Promise<{
        id: any;
        name: any;
        localized_name: any;
        primary_attr: any;
        attack_type: any;
        roles: any;
    }[]>;
}
