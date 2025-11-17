import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import { PlayerCache } from '../models/player-cache.model';

@Module({
  imports: [SequelizeModule.forFeature([User, PlayerCache])],
  exports: [SequelizeModule],
})
export class DatabaseModule {}

