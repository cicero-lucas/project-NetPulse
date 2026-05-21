import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ServiceStatus } from '@prisma/client';

@Processor('metrics')
export class MetricsProcessor {
  private readonly logger = new Logger(MetricsProcessor.name);

  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) {}

  @Process('alert-metric')
  async handleAlertMetric(job: Job<{ customerId: string; metric: any }>) {
    const { customerId, metric } = job.data;
    this.logger.warn(`Alerta de métrica para cliente ${customerId}: latência ${metric.latency}ms, status ${metric.status}`);

    const customer = await this.prisma.customer.findUnique({ where: { id: customerId }, include: { user: true } });
    if (customer?.user) {
      const msg = metric.status === ServiceStatus.OFFLINE
        ? 'Seu serviço está offline. Nossa equipe foi notificada.'
        : `Latência elevada detectada: ${metric.latency.toFixed(0)}ms`;
      await this.notificationsService.create(customer.user.id, 'Alerta de Serviço', msg, 'ALERT');
    }
  }
}
