import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { CreateCustomerDto, UpdateCustomerDto, CreatePlanDto, CustomerFilterDto } from './dto/customer.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cadastrar cliente' })
  create(@Body() dto: CreateCustomerDto) { return this.customersService.create(dto); }

  @Get()
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Listar clientes' })
  findAll(@Query() query: CustomerFilterDto) { return this.customersService.findAll(query); }

  @Get('plans')
  @ApiOperation({ summary: 'Listar planos' })
  findAllPlans() { return this.customersService.findAllPlans(); }

  @Post('plans')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar plano' })
  createPlan(@Body() dto: CreatePlanDto) { return this.customersService.createPlan(dto); }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente' })
  findOne(@Param('id') id: string) { return this.customersService.findOne(id); }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TECNICO)
  @ApiOperation({ summary: 'Atualizar cliente' })
  update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) { return this.customersService.update(id, dto); }

  @Get(':id/history')
  @ApiOperation({ summary: 'Histórico do cliente' })
  getHistory(@Param('id') id: string) { return this.customersService.getHistory(id); }
}
