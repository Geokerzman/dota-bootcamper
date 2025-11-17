import { MatchService } from './match.service';
export declare class MatchController {
    private matchService;
    constructor(matchService: MatchService);
    getMatches(user: any): Promise<any>;
}
