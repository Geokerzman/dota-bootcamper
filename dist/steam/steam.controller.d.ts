import { SteamService } from './steam.service';
export declare class SteamController {
    private steamService;
    constructor(steamService: SteamService);
    linkSteam(body: {
        steamid: string;
    }, user: any): Promise<import("../models/user.model").User>;
}
