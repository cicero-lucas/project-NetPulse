import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Processor('notifications')
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) {}

  @Process('ticket-created')
  async handleTicketCreated(job: Job<{ ticketId: string; customerId: string }>) {
    this.logger.log(`Processando notificação de chamado criado: ${job.data.ticketId}`);
    const ticket = await this.prisma.ticket.findUnique({ where: { id: job.data.ticketId }, include: { customer: { include: { user: true } } } });
    if (ticket?.customer?.user) {
      await this.notificationsService.create(ticket.customer.user.id, 'Chamado Aberto', `Seu chamado #${ticket.id.slice(0, 8)} foi aberto com prioridade ${ticket.priority}`, 'TICKET');
    }
  }

  @Process('ticket-updated')
  async handleTicketUpdated(job: Job<{ ticketId: string; status: string }>) {
    this.logger.log(`Processando atualização de chamado: ${job.data.ticketId} -> ${job.data.status}`);
    const ticket = await this.prisma.ticket.findUnique({ where: { id: job.data.ticketId }, include: { customer: { include: { user: true } } } });
    if (ticket?.customer?.user) {
      await this.notificationsService.create(ticket.customer.user.id, 'Chamado Atualizado', `Seu chamado #${ticket.id.slice(0, 8)} foi atualizado para ${job.data.status}`, 'TICKET');
    }
  }
}
