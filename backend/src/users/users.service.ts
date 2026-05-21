import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../config/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, UpdateUserDto, PaginationDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email já cadastrado');

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { ...dto, password } });
    const { password: _, refreshToken: __, ...result } = user;
    return result;
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;
    const where = search ? { OR: [{ name: { contains: search, mode: 'insensitive' as any } }, { email: { contains: search, mode: 'insensitive' as any } }] } : {};

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({ where, skip, take: +limit, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page: +page, limit: +limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, customer: { include: { plan: true } } } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.update({ where: { id }, data });
    const { password: _, refreshToken: __, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.update({ where: { id }, data: { isActive: false } });
    return { message: 'Usuário desativado com sucesso' };
  }
}
