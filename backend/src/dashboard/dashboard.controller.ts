import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Métricas do dashboard' })
  getMetrics() { return this.dashboardService.getMetrics(); }

  @Get('charts')
  @ApiOperation({ summary: 'Dados para gráficos' })
  getChartData() { return this.dashboardService.getChartData(); }
}
