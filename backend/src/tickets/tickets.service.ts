import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateTicketDto, UpdateTicketDto, AddCommentDto, TicketFilterDto } from './dto/ticket.dto';
import { TicketStatus } from '@prisma/client';

const SLA_HOURS: Record<string, number> = { CRITICA: 2, ALTA: 4, MEDIA: 8, BAIXA: 24 };

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async create(dto: CreateTicketDto, createdById: string) {
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + SLA_HOURS[dto.priority]);

    const ticket = await this.prisma.ticket.create({
      data: { ...dto, createdById, slaDeadline },
      include: { customer: { include: { user: { select: { name: true, email: true } } } }, createdBy: { select: { name: true } } },
    });

    await this.prisma.ticketHistory.create({ data: { ticketId: ticket.id, toStatus: TicketStatus.ABERTO, changedById: createdById, note: 'Chamado aberto' } });
    await this.notificationsQueue.add('ticket-created', { ticketId: ticket.id, customerId: dto.customerId });

    return ticket;
  }

  async findAll(query: TicketFilterDto) {
    const { page = 1, limit = 10, status, priority, customerId, assignedToId, search } = query;
    const skip = (page - 1) * +limit;
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (customerId) where.customerId = customerId;
    if (assignedToId) where.assignedToId = assignedToId;
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];

    const [data, total] = await Promise.all([
      this.prisma.ticket.findMany({ where, skip, take: +limit, include: { customer: { include: { user: { select: { name: true } } } }, assignedTo: { select: { name: true } }, createdBy: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.ticket.count({ where }),
    ]);

    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) } };
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { customer: { include: { user: { select: { name: true, email: true } }, plan: true } }, assignedTo: { select: { name: true, email: true } }, createdBy: { select: { name: true } }, comments: { include: { user: { select: { name: true, role: true } } }, orderBy: { createdAt: 'asc' } }, history: { orderBy: { createdAt: 'asc' } }, attachments: true },
    });
    if (!ticket) throw new NotFoundException('Chamado não encontrado');
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto, userId: string) {
    const ticket = await this.findOne(id);
    const data: any = { ...dto };

    if (dto.status && dto.status !== ticket.status) {
      if (dto.status === TicketStatus.RESOLVIDO) data.resolvedAt = new Date();
      if (dto.status === TicketStatus.FECHADO) data.closedAt = new Date();

      await this.prisma.ticketHistory.create({ data: { ticketId: id, fromStatus: ticket.status, toStatus: dto.status, changedById: userId } });
      await this.notificationsQueue.add('ticket-updated', { ticketId: id, status: dto.status });
    }

    return this.prisma.ticket.update({ where: { id }, data, include: { customer: { include: { user: { select: { name: true } } } }, assignedTo: { select: { name: true } } } });
  }

  async addComment(ticketId: string, dto: AddCommentDto, userId: string) {
    await this.findOne(ticketId);
    return this.prisma.ticketComment.create({ data: { ticketId, userId, ...dto }, include: { user: { select: { name: true, role: true } } } });
  }

  async getStats() {
    const [byStatus, byPriority] = await Promise.all([
      this.prisma.ticket.groupBy({ by: ['status'], _count: true }),
      this.prisma.ticket.groupBy({ by: ['priority'], _count: true }),
    ]);
    return { byStatus, byPriority };
  }
}
