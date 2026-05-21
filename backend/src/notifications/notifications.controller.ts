import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificações' })
  findAll(@CurrentUser('id') userId: string) { return this.notificationsService.findAll(userId); }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contagem de não lidas' })
  getUnreadCount(@CurrentUser('id') userId: string) { return this.notificationsService.getUnreadCount(userId); }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar como lida' })
  markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) { return this.notificationsService.markAsRead(id, userId); }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas como lidas' })
  markAllAsRead(@CurrentUser('id') userId: string) { return this.notificationsService.markAllAsRead(userId); }
}
