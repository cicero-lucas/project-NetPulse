import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../config/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: jest.Mocked<PrismaService>;
  let jwt: jest.Mocked<JwtService>;

  const mockUser = { id: 'user-1', email: 'test@test.com', password: '', role: 'ADMIN', isActive: true, name: 'Test', refreshToken: null };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: { user: { findUnique: jest.fn(), update: jest.fn() } } },
        { provide: JwtService, useValue: { signAsync: jest.fn().mockResolvedValue('token'), verify: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);
  });

  it('should be defined', () => expect(service).toBeDefined());

  it('should throw UnauthorizedException for invalid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(service.login({ email: 'x@x.com', password: '123456' })).rejects.toThrow(UnauthorizedException);
  });

  it('should login successfully', async () => {
    const hash = await bcrypt.hash('password', 10);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ ...mockUser, password: hash });
    (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.login({ email: 'test@test.com', password: 'password' });
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('user');
  });

  it('should logout successfully', async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);
    const result = await service.logout('user-1');
    expect(result.message).toContain('sucesso');
  });
});
