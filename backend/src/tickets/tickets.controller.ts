import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, UpdateTicketDto, AddCommentDto, TicketFilterDto } from './dto/ticket.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Abrir chamado' })
  create(@Body() dto: CreateTicketDto, @CurrentUser('id') userId: string) {
    return this.ticketsService.create(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar chamados' })
  findAll(@Query() query: TicketFilterDto) { return this.ticketsService.findAll(query); }

  @Get('stats')
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Estatísticas de chamados' })
  getStats() { return this.ticketsService.getStats(); }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar chamado' })
  findOne(@Param('id') id: string) { return this.ticketsService.findOne(id); }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Atualizar chamado' })
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto, @CurrentUser('id') userId: string) {
    return this.ticketsService.update(id, dto, userId);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Adicionar comentário' })
  addComment(@Param('id') id: string, @Body() dto: AddCommentDto, @CurrentUser('id') userId: string) {
    return this.ticketsService.addComment(id, dto, userId);
  }
}
