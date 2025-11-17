import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { OpenDotaService } from '../services/open-dota.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [LibraryController],
  providers: [LibraryService, OpenDotaService],
  exports: [LibraryService],
})
export class LibraryModule {}

