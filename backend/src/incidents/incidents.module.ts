import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';

@Module({
  imports: [BullModule.registerQueue({ name: 'incidents' })],
  providers: [IncidentsService],
  controllers: [IncidentsController],
})
export class IncidentsModule {}
