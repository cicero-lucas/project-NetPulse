import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../config/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RefreshTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });

    return { ...tokens, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async refresh(dto: RefreshTokenDto) {
    try {
      const payload = this.jwt.verify(dto.refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.refreshToken !== dto.refreshToken) throw new UnauthorizedException();

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken: tokens.refreshToken } });
      return tokens;
    } catch {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
    return { message: 'Logout realizado com sucesso' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'Se o email existir, você receberá as instruções' };
    // Em produção: enviar email com token via fila RabbitMQ
    return { message: 'Se o email existir, você receberá as instruções' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN || '15m' }),
      this.jwt.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }),
    ]);
    return { accessToken, refreshToken };
  }
}
