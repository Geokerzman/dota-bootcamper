import { OpenDotaService } from '../services/open-dota.service';
export declare class ProPlayersService {
    private openDotaService;
    private readonly logger;
    constructor(openDotaService: OpenDotaService);
    getProPlayers(): Promise<{
        account_id: any;
        personaname: any;
        name: any;
        steamid: any;
        avatarmedium: any;
        last_login: any;
        profileurl: any;
        team_id: any;
        team_name: any;
    }[]>;
}
