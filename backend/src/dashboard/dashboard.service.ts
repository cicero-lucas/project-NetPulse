import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { TicketStatus, TicketPriority, IncidentSeverity, ServiceStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalCustomers, activeCustomers,
      totalTickets, openTickets, resolvedTickets,
      totalIncidents, activeIncidents,
      ticketsByStatus, ticketsByPriority,
      incidentsBySeverity,
      recentTickets, recentIncidents,
      serviceOverview,
    ] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.count({ where: { serviceStatus: ServiceStatus.ONLINE } }),
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: { notIn: [TicketStatus.RESOLVIDO, TicketStatus.FECHADO] } } }),
      this.prisma.ticket.count({ where: { status: TicketStatus.RESOLVIDO, resolvedAt: { gte: thirtyDaysAgo } } }),
      this.prisma.incident.count(),
      this.prisma.incident.count({ where: { isResolved: false } }),
      this.prisma.ticket.groupBy({ by: ['status'], _count: true }),
      this.prisma.ticket.groupBy({ by: ['priority'], _count: true }),
      this.prisma.incident.groupBy({ by: ['severity'], _count: true }),
      this.prisma.ticket.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: { include: { user: { select: { name: true } } } } } }),
      this.prisma.incident.findMany({ take: 5, orderBy: { createdAt: 'desc' }, where: { isResolved: false } }),
      this.prisma.customer.groupBy({ by: ['serviceStatus'], _count: true }),
    ]);

    const resolvedWithTime = await this.prisma.ticket.findMany({
      where: { resolvedAt: { not: null }, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, resolvedAt: true },
    });

    const avgResolutionHours = resolvedWithTime.length
      ? resolvedWithTime.reduce((sum, t) => sum + (t.resolvedAt!.getTime() - t.createdAt.getTime()), 0) / resolvedWithTime.length / 3600000
      : 0;

    return {
      customers: { total: totalCustomers, active: activeCustomers, uptime: totalCustomers ? +((activeCustomers / totalCustomers) * 100).toFixed(1) : 100 },
      tickets: { total: totalTickets, open: openTickets, resolvedLast30Days: resolvedTickets, avgResolutionHours: +avgResolutionHours.toFixed(1), byStatus: ticketsByStatus, byPriority: ticketsByPriority },
      incidents: { total: totalIncidents, active: activeIncidents, bySeverity: incidentsBySeverity },
      services: { overview: serviceOverview },
      recent: { tickets: recentTickets, incidents: recentIncidents },
    };
  }

  async getChartData() {
    const days = 7;
    const labels: string[] = [];
    const ticketsData: number[] = [];
    const incidentsData: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));

      labels.push(start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
      const [t, inc] = await Promise.all([
        this.prisma.ticket.count({ where: { createdAt: { gte: start, lte: end } } }),
        this.prisma.incident.count({ where: { createdAt: { gte: start, lte: end } } }),
      ]);
      ticketsData.push(t);
      incidentsData.push(inc);
    }

    return { labels, datasets: { tickets: ticketsData, incidents: incidentsData } };
  }
}
