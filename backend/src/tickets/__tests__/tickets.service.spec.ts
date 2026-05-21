import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from '../tickets.service';
import { PrismaService } from '../../config/prisma.service';
import { getQueueToken } from '@nestjs/bull';
import { NotFoundException } from '@nestjs/common';
import { TicketPriority, TicketStatus } from '@prisma/client';

describe('TicketsService', () => {
  let service: TicketsService;
  let prisma: jest.Mocked<PrismaService>;

  const mockTicket = { id: 'ticket-1', title: 'Test', description: 'Desc', status: TicketStatus.ABERTO, priority: TicketPriority.MEDIA, customerId: 'cust-1', createdById: 'user-1', slaDeadline: new Date() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: { ticket: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn(), update: jest.fn(), groupBy: jest.fn() }, ticketHistory: { create: jest.fn() }, ticketComment: { create: jest.fn() } } },
        { provide: getQueueToken('notifications'), useValue: { add: jest.fn() } },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('should create a ticket', async () => {
    (prisma.ticket.create as jest.Mock).mockResolvedValue(mockTicket);
    (prisma.ticketHistory.create as jest.Mock).mockResolvedValue({});

    const result = await service.create({ title: 'Test', description: 'Desc', priority: TicketPriority.MEDIA, customerId: 'cust-1' }, 'user-1');
    expect(result).toHaveProperty('id');
    expect(prisma.ticket.create).toHaveBeenCalled();
  });

  it('should throw NotFoundException for non-existent ticket', async () => {
    (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
  });

  it('should list tickets with pagination', async () => {
    (prisma.ticket.findMany as jest.Mock).mockResolvedValue([mockTicket]);
    (prisma.ticket.count as jest.Mock).mockResolvedValue(1);

    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
    expect(result.meta.total).toBe(1);
  });
});
