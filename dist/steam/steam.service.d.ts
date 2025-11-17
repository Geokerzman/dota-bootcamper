import { OpenDotaService } from '../services/open-dota.service';
import { User } from '../models/user.model';
export declare class SteamService {
    private userModel;
    private openDotaService;
    constructor(userModel: typeof User, openDotaService: OpenDotaService);
    linkSteam(steamid: string, userId: number): Promise<User>;
}
