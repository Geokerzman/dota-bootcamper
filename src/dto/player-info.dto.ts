export class PlayerProfileDto {
  account_id: number;
  personaname: string;
  name: string;
  steamid: string;
  avatarmedium: string;
  avatarfull?: string;
  last_login: string;
  profileurl: string;
  plus?: boolean;
  loccountrycode?: string;
}

export class PlayerInfoDto {
  solo_competitive_rank: number | null;
  competitive_rank: number | null;
  rank_tier: number | null;
  leaderboard_rank: number | null;
  profile: PlayerProfileDto;
}

export class PlayerInfoResponseDto {
  data: PlayerInfoDto[];
}

