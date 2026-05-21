import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { IncidentSeverity } from '@prisma/client';

@Processor('incidents')
export class IncidentsProcessor {
  private readonly logger = new Logger(IncidentsProcessor.name);

  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) {}

  @Process('process-incident')
  async handleIncident(job: Job<{ incidentId: string; severity: IncidentSeverity }>) {
    this.logger.log(`Processando incidente: ${job.data.incidentId} - Severidade: ${job.data.severity}`);

    if (job.data.severity === IncidentSeverity.CRITICAL || job.data.severity === IncidentSeverity.HIGH) {
      const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN', isActive: true } });
      for (const admin of admins) {
        await this.notificationsService.create(admin.id, `Incidente ${job.data.severity}`, `Novo incidente crítico registrado. ID: ${job.data.incidentId.slice(0, 8)}`, 'INCIDENT');
      }
    }
  }
}
