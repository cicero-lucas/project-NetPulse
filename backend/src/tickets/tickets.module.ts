import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [BullModule.registerQueue({ name: 'notifications' })],
  providers: [TicketsService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketsModule {}
