import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { AlertType, AlertStatus } from '../models/alert.model';

@Controller('api/alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAlert(
    @GetUser() user: any,
    @Body()
    body: {
      alertType: AlertType;
      alertName: string;
      targetId?: number;
      conditions?: any;
    },
  ) {
    return this.alertsService.createAlert(
      user.id,
      body.alertType,
      body.alertName,
      body.targetId,
      body.conditions,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserAlerts(@GetUser() user: any, @Query('status') status?: AlertStatus) {
    return this.alertsService.getUserAlerts(user.id, status);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAlert(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() body: { alertName?: string; conditions?: any; status?: AlertStatus },
  ) {
    return this.alertsService.updateAlert(user.id, parseInt(id, 10), body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAlert(@GetUser() user: any, @Param('id') id: string) {
    await this.alertsService.deleteAlert(user.id, parseInt(id, 10));
    return { message: 'Alert deleted' };
  }
}

