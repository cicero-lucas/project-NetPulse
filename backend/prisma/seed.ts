import { PrismaClient, Role, PlanType, ServiceStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const techPassword = await bcrypt.hash('Tech@123', 10);
  const clientPassword = await bcrypt.hash('Client@123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@netpulse.com' },
    update: {},
    create: { name: 'Administrador', email: 'admin@netpulse.com', password: adminPassword, role: Role.ADMIN },
  });

  const tech = await prisma.user.upsert({
    where: { email: 'tecnico@netpulse.com' },
    update: {},
    create: { name: 'Técnico Silva', email: 'tecnico@netpulse.com', password: techPassword, role: Role.TECNICO },
  });

  const clientUser = await prisma.user.upsert({
    where: { email: 'cliente@netpulse.com' },
    update: {},
    create: { name: 'João Cliente', email: 'cliente@netpulse.com', password: clientPassword, role: Role.CLIENTE },
  });

  const basicPlan = await prisma.internetPlan.upsert({
    where: { id: 'plan-basic-001' },
    update: {},
    create: { id: 'plan-basic-001', name: 'Básico 100MB', type: PlanType.BASICO, downloadSpeed: 100, uploadSpeed: 50, price: 79.90, slaHours: 8 },
  });

  const advancedPlan = await prisma.internetPlan.upsert({
    where: { id: 'plan-adv-001' },
    update: {},
    create: { id: 'plan-adv-001', name: 'Avançado 500MB', type: PlanType.AVANCADO, downloadSpeed: 500, uploadSpeed: 250, price: 149.90, slaHours: 4 },
  });

  const businessPlan = await prisma.internetPlan.upsert({
    where: { id: 'plan-biz-001' },
    update: {},
    create: { id: 'plan-biz-001', name: 'Empresarial 1GB', type: PlanType.EMPRESARIAL, downloadSpeed: 1000, uploadSpeed: 500, price: 299.90, slaHours: 2 },
  });

  await prisma.customer.upsert({
    where: { userId: clientUser.id },
    update: {},
    create: {
      userId: clientUser.id,
      document: '123.456.789-00',
      phone: '(11) 99999-0001',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      planId: basicPlan.id,
      serviceStatus: ServiceStatus.ONLINE,
    },
  });

  console.log('Seed concluído:', { admin: admin.email, tech: tech.email, client: clientUser.email });
}

main().catch(console.error).finally(() => prisma.$disconnect());
