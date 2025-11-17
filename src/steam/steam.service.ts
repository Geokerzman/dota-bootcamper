import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OpenDotaService } from '../services/open-dota.service';
import { User } from '../models/user.model';

@Injectable()
export class SteamService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private openDotaService: OpenDotaService,
  ) {}

  async linkSteam(steamid: string, userId: number) {
    const player = await this.openDotaService.getPlayerSummaries(steamid);

    if (!player) {
      throw new BadRequestException('Invalid Steam ID');
    }

    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.steamid = steamid;
    user.profileurl = player.profile?.profileurl || null;
    user.avatar = player.profile?.avatarfull || null;
    user.account_id = player.profile?.account_id || null;
    await user.save();

    return user;
  }
}

