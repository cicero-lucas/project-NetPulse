import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateIncidentDto, IncidentFilterDto } from './dto/incident.dto';

@Injectable()
export class IncidentsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('incidents') private incidentsQueue: Queue,
  ) {}

  async create(dto: CreateIncidentDto) {
    const incident = await this.prisma.incident.create({ data: dto, include: { customer: { include: { user: { select: { name: true } } } } } });
    await this.incidentsQueue.add('process-incident', { incidentId: incident.id, severity: dto.severity });
    return incident;
  }

  async findAll(query: IncidentFilterDto) {
    const { page = 1, limit = 10, severity, isResolved } = query;
    const skip = (page - 1) * +limit;
    const where: any = {};
    if (severity) where.severity = severity;
    if (isResolved !== undefined) where.isResolved = isResolved === true || isResolved === ('true' as any);

    const [data, total] = await Promise.all([
      this.prisma.incident.findMany({ where, skip, take: +limit, include: { customer: { include: { user: { select: { name: true } } } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.incident.count({ where }),
    ]);

    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) } };
  }

  async findOne(id: string) {
    const incident = await this.prisma.incident.findUnique({ where: { id }, include: { customer: { include: { user: { select: { name: true, email: true } } } } } });
    if (!incident) throw new NotFoundException('Incidente não encontrado');
    return incident;
  }

  async resolve(id: string) {
    await this.findOne(id);
    return this.prisma.incident.update({ where: { id }, data: { isResolved: true, resolvedAt: new Date() } });
  }
}
