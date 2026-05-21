import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';

@Module({
  imports: [BullModule.registerQueue({ name: 'metrics' })],
  providers: [MonitoringService],
  controllers: [MonitoringController],
  exports: [MonitoringService],
})
export class MonitoringModule {}
