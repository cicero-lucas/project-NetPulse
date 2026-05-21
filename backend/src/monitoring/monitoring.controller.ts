import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MonitoringService } from './monitoring.service';
import { CreateMetricDto } from './dto/monitoring.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Monitoring')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('monitoring')
export class MonitoringController {
  constructor(private monitoringService: MonitoringService) {}

  @Post('metrics')
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Registrar métrica' })
  recordMetric(@Body() dto: CreateMetricDto) { return this.monitoringService.recordMetric(dto); }

  @Get('overview')
  @ApiOperation({ summary: 'Visão geral do monitoramento' })
  getOverview() { return this.monitoringService.getOverview(); }

  @Get('customers/:id/metrics')
  @ApiOperation({ summary: 'Métricas do cliente' })
  @ApiQuery({ name: 'hours', required: false, type: Number })
  getCustomerMetrics(@Param('id') id: string, @Query('hours') hours?: number) {
    return this.monitoringService.getCustomerMetrics(id, hours);
  }

  @Post('simulate')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Simular métricas (dev)' })
  simulate() { return this.monitoringService.simulateMetrics(); }
}
