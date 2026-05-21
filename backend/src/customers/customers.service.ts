import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto, CreatePlanDto, CustomerFilterDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    const exists = await this.prisma.customer.findFirst({ where: { document: dto.document } });
    if (exists) throw new ConflictException('Documento já cadastrado');
    return this.prisma.customer.create({ data: dto, include: { user: { select: { name: true, email: true } }, plan: true } });
  }

  async findAll(query: CustomerFilterDto) {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * +limit;
    const where: any = {};
    if (status) where.serviceStatus = status;
    if (search) where.OR = [
      { user: { name: { contains: search, mode: 'insensitive' } } },
      { document: { contains: search } },
      { city: { contains: search, mode: 'insensitive' } },
    ];

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({ where, skip, take: +limit, include: { user: { select: { name: true, email: true } }, plan: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.customer.count({ where }),
    ]);

    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) } };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { user: { select: { name: true, email: true, role: true } }, plan: true, tickets: { take: 5, orderBy: { createdAt: 'desc' } }, incidents: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
    if (!customer) throw new NotFoundException('Cliente não encontrado');
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({ where: { id }, data: dto, include: { user: { select: { name: true, email: true } }, plan: true } });
  }

  async getHistory(id: string) {
    await this.findOne(id);
    const [tickets, incidents, metrics] = await Promise.all([
      this.prisma.ticket.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.incident.findMany({ where: { customerId: id }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.prisma.serviceMetric.findMany({ where: { customerId: id }, orderBy: { recordedAt: 'desc' }, take: 10 }),
    ]);
    return { tickets, incidents, metrics };
  }

  async createPlan(dto: CreatePlanDto) {
    return this.prisma.internetPlan.create({ data: dto });
  }

  async findAllPlans() {
    return this.prisma.internetPlan.findMany({ where: { isActive: true }, orderBy: { price: 'asc' } });
  }
}
