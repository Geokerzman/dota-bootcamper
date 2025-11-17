import { ProPlayersService } from './pro-players.service';
export declare class ProPlayersController {
    private proPlayersService;
    constructor(proPlayersService: ProPlayersService);
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
