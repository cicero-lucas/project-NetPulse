import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationsProcessor } from './notifications.processor';
import { IncidentsProcessor } from './incidents.processor';
import { MetricsProcessor } from './metrics.processor';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'notifications' }, { name: 'incidents' }, { name: 'metrics' }),
    NotificationsModule,
  ],
  providers: [NotificationsProcessor, IncidentsProcessor, MetricsProcessor],
})
export class QueuesModule {}
