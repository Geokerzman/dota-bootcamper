export class PlayerOverviewDto {
  profile: any;
  wl: {
    win: number;
    lose: number;
  };
  recentMatches: any[];
  heroes: any[];
  peers: any[];
  totals: any[];
  counts: any;
  ratings: any[];
}

