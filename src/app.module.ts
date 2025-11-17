import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { MatchModule } from './match/match.module';
import { HeroModule } from './hero/hero.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { LiveModule } from './live/live.module';
import { SteamModule } from './steam/steam.module';
import { ProPlayersModule } from './pro-players/pro-players.module';
import { DatabaseModule } from './database/database.module';
import { User } from './models/user.model';
import { PlayerCache } from './models/player-cache.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, PlayerCache],
      autoLoadModels: true,
      synchronize: false, // Set to false in production
    }),
    DatabaseModule,
    AuthModule,
    PlayerModule,
    MatchModule,
    HeroModule,
    LeaderboardModule,
    LiveModule,
    SteamModule,
    ProPlayersModule,
  ],
})
export class AppModule {}

