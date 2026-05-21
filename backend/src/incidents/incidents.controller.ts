import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto, IncidentFilterDto } from './dto/incident.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Incidents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private incidentsService: IncidentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Registrar incidente' })
  create(@Body() dto: CreateIncidentDto) { return this.incidentsService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Listar incidentes' })
  findAll(@Query() query: IncidentFilterDto) { return this.incidentsService.findAll(query); }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar incidente' })
  findOne(@Param('id') id: string) { return this.incidentsService.findOne(id); }

  @Patch(':id/resolve')
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Resolver incidente' })
  resolve(@Param('id') id: string) { return this.incidentsService.resolve(id); }
}
