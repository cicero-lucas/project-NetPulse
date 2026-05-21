import { Injectable } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateMetricDto } from './dto/monitoring.dto';
import { ServiceStatus } from '@prisma/client';

@Injectable()
export class MonitoringService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('metrics') private metricsQueue: Queue,
  ) {}

  async recordMetric(dto: CreateMetricDto) {
    const metric = await this.prisma.serviceMetric.create({ data: dto });

    if (dto.status === ServiceStatus.OFFLINE || dto.latency > 200) {
      await this.metricsQueue.add('alert-metric', { customerId: dto.customerId, metric });
    }

    await this.prisma.customer.update({ where: { id: dto.customerId }, data: { serviceStatus: dto.status || ServiceStatus.ONLINE } });
    return metric;
  }

  async getCustomerMetrics(customerId: string, hours = 24) {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    const metrics = await this.prisma.serviceMetric.findMany({
      where: { customerId, recordedAt: { gte: since } },
      orderBy: { recordedAt: 'asc' },
    });

    const avgLatency = metrics.reduce((s, m) => s + m.latency, 0) / (metrics.length || 1);
    const avgUptime = metrics.reduce((s, m) => s + m.uptime, 0) / (metrics.length || 1);
    const onlineCount = metrics.filter(m => m.status === ServiceStatus.ONLINE).length;

    return { metrics, summary: { avgLatency: +avgLatency.toFixed(2), avgUptime: +avgUptime.toFixed(2), availability: metrics.length ? +((onlineCount / metrics.length) * 100).toFixed(2) : 100 } };
  }

  async getOverview() {
    const [total, online, offline, degraded] = await Promise.all([
      this.prisma.customer.count(),
      this.prisma.customer.count({ where: { serviceStatus: ServiceStatus.ONLINE } }),
      this.prisma.customer.count({ where: { serviceStatus: ServiceStatus.OFFLINE } }),
      this.prisma.customer.count({ where: { serviceStatus: ServiceStatus.DEGRADED } }),
    ]);

    const recentMetrics = await this.prisma.serviceMetric.findMany({ take: 100, orderBy: { recordedAt: 'desc' } });
    const avgLatency = recentMetrics.reduce((s, m) => s + m.latency, 0) / (recentMetrics.length || 1);

    return { totalCustomers: total, online, offline, degraded, avgLatency: +avgLatency.toFixed(2), uptime: total ? +((online / total) * 100).toFixed(2) : 100 };
  }

  async simulateMetrics() {
    const customers = await this.prisma.customer.findMany({ take: 10 });
    const statuses = [ServiceStatus.ONLINE, ServiceStatus.ONLINE, ServiceStatus.ONLINE, ServiceStatus.DEGRADED, ServiceStatus.OFFLINE];

    for (const customer of customers) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      await this.recordMetric({
        customerId: customer.id,
        latency: Math.random() * 150 + 5,
        uptime: Math.random() * 10 + 90,
        packetLoss: Math.random() * 2,
        downloadSpeed: Math.random() * 100 + 50,
        uploadSpeed: Math.random() * 50 + 25,
        status,
      });
    }
    return { message: `Métricas simuladas para ${customers.length} clientes` };
  }
}
