import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { LibraryItemType } from '../models/library.model';

@Controller('api/library')
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getLibrary(@GetUser() user: any, @Query('type') type?: LibraryItemType) {
    return this.libraryService.getLibrary(user.id, type);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addToLibrary(
    @GetUser() user: any,
    @Body() body: { itemType: LibraryItemType; itemId: number; notes?: string },
  ) {
    return this.libraryService.addToLibrary(user.id, body.itemType, body.itemId, body.notes);
  }

  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard)
  async removeFromLibrary(
    @GetUser() user: any,
    @Param('type') type: LibraryItemType,
    @Param('id') id: string,
  ) {
    await this.libraryService.removeFromLibrary(user.id, type, parseInt(id, 10));
    return { message: 'Item removed from library' };
  }

  @Put(':type/:id/notes')
  @UseGuards(JwtAuthGuard)
  async updateNotes(
    @GetUser() user: any,
    @Param('type') type: LibraryItemType,
    @Param('id') id: string,
    @Body() body: { notes: string },
  ) {
    return this.libraryService.updateNotes(user.id, type, parseInt(id, 10), body.notes);
  }

  @Get('check/:type/:id')
  @UseGuards(JwtAuthGuard)
  async checkInLibrary(
    @GetUser() user: any,
    @Param('type') type: LibraryItemType,
    @Param('id') id: string,
  ) {
    const isInLibrary = await this.libraryService.isInLibrary(
      user.id,
      type,
      parseInt(id, 10),
    );
    return { isInLibrary };
  }
}

