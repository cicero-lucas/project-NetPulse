# NetPulse 🌐

Plataforma corporativa full stack para monitoramento e gerenciamento de serviços de internet, desenvolvida para empresas de telecomunicações (ISPs).
<div style="display:flex; gap:6px; justify-content:center;">
   <img src="https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Bull-FF0000?logo=nestjs&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" height="24" />
  <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=githubactions&logoColor=white" height="24" />
</div>

---

## Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        NETPULSE                             │
├──────────────┬──────────────────────────────────────────────┤
│   Frontend   │              Backend                         │
│  Next.js 14  │            NestJS 10                         │
│  TypeScript  │            TypeScript                        │
│  TailwindCSS │         ┌──────────────┐                     │
│  React Query │         │  REST API    │                     │
│  Zod         │◄───────►│  JWT Auth    │                     │
│              │         │  Swagger     │                     │
└──────────────┘         └──────┬───────┘                     │
                                │                             │
              ┌─────────────────┼─────────────────┐           │
              ▼                 ▼                 ▼           │
         PostgreSQL           Redis           RabbitMQ        │
         (Prisma ORM)        (Cache)          (Filas)         │
└─────────────────────────────────────────────────────────────┘
```

## Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 14 | Framework React com App Router |
| TypeScript | 5 | Tipagem estática |
| TailwindCSS | 3 | Estilização |
| React Query | 5 | Cache e sincronização de dados |
| Axios | 1.7 | Cliente HTTP |
| Zod | 3 | Validação de schemas |
| Recharts | 2 | Gráficos e visualizações |

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| NestJS | 10 | Framework Node.js |
| TypeScript | 5 | Tipagem estática |
| Prisma | 5 | ORM e migrations |
| PostgreSQL | 15 | Banco de dados principal |
| Redis | 7 | Cache e sessões |
| Bull | 4 | Filas de processamento |
| JWT | - | Autenticação |
| Swagger | 7 | Documentação da API |

### DevOps
| Tecnologia | Uso |
|---|---|
| Docker | Containerização |
| Docker Compose | Orquestração local |
| GitHub Actions | CI/CD |

---

## Estrutura do Projeto

```
netpulse/
├── .github/
│   └── workflows/
│       └── ci.yml                  # Pipeline CI/CD
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Modelagem do banco
│   │   └── seed.ts                 # Dados iniciais
│   └── src/
│       ├── auth/                   # Autenticação JWT
│       │   ├── dto/
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   └── jwt.strategy.ts
│       ├── users/                  # Gestão de usuários
│       ├── customers/              # Gestão de clientes
│       ├── tickets/                # Sistema de chamados
│       ├── incidents/              # Registro de incidentes
│       ├── monitoring/             # Monitoramento de serviços
│       ├── dashboard/              # Métricas e KPIs
│       ├── notifications/          # Notificações
│       ├── queues/                 # Processadores Bull/RabbitMQ
│       │   ├── notifications.processor.ts
│       │   ├── incidents.processor.ts
│       │   └── metrics.processor.ts
│       ├── common/
│       │   ├── decorators/         # @CurrentUser, @Roles
│       │   ├── filters/            # GlobalExceptionFilter
│       │   ├── guards/             # RolesGuard
│       │   └── interceptors/       # LoggingInterceptor
│       ├── config/
│       │   ├── prisma.service.ts
│       │   └── prisma.module.ts
│       ├── app.module.ts
│       └── main.ts
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/login/       # Página de login
│       │   ├── (dashboard)/        # Layout autenticado
│       │   │   ├── dashboard/      # Dashboard principal
│       │   │   ├── customers/      # Gestão de clientes
│       │   │   ├── tickets/        # Chamados técnicos
│       │   │   ├── incidents/      # Incidentes
│       │   │   ├── monitoring/     # Monitoramento
│       │   │   └── notifications/  # Notificações
│       │   ├── layout.tsx
│       │   └── providers.tsx
│       ├── components/
│       │   ├── ui/                 # Button, Input, Card, Table, Modal
│       │   ├── layout/             # Sidebar, Header
│       │   └── charts/             # Recharts wrappers
│       ├── hooks/
│       │   └── useApi.ts           # React Query hooks
│       ├── lib/
│       │   ├── api.ts              # Axios instance + interceptors
│       │   ├── services.ts         # API service functions
│       │   └── utils.ts            # Helpers e constantes
│       ├── store/
│       │   └── auth.context.tsx    # Contexto de autenticação
│       └── types/
│           └── index.ts            # TypeScript interfaces
└── docker-compose.yml
```

---

## Instruções para Execução

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

### Com Docker (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/netpulse.git
cd netpulse

# 2. Suba todos os serviços
docker-compose up -d

# 3. Execute as migrations e seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx ts-node prisma/seed.ts

# 4. Acesse a aplicação
# Frontend:  http://localhost:3000
# Backend:   http://localhost:3001
# Swagger:   http://localhost:3001/api/docs
# RabbitMQ:  http://localhost:15672 (netpulse/netpulse123)
```

### Desenvolvimento Local

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/seed.ts
npm run start:dev

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

### Variáveis de Ambiente

**Backend (.env)**
```env
DATABASE_URL="postgresql://netpulse:netpulse123@localhost:5432/netpulse_db"
REDIS_URL="redis://localhost:6379"
RABBITMQ_URL="amqp://netpulse:netpulse123@localhost:5672"
JWT_SECRET="netpulse_jwt_secret_key_2024"
JWT_REFRESH_SECRET="netpulse_refresh_secret_key_2024"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Endpoints da API

### Autenticação
| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/v1/auth/login` | Login com email/senha |
| POST | `/api/v1/auth/refresh` | Renovar access token |
| POST | `/api/v1/auth/logout` | Logout |
| POST | `/api/v1/auth/forgot-password` | Recuperação de senha |

### Usuários
| Método | Endpoint | Permissão |
|---|---|---|
| GET | `/api/v1/users` | ADMIN, TECNICO |
| POST | `/api/v1/users` | ADMIN |
| GET | `/api/v1/users/:id` | Autenticado |
| PATCH | `/api/v1/users/:id` | ADMIN |
| DELETE | `/api/v1/users/:id` | ADMIN |

### Clientes
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/customers` | Listar com filtros e paginação |
| POST | `/api/v1/customers` | Cadastrar cliente |
| GET | `/api/v1/customers/:id` | Detalhes do cliente |
| PATCH | `/api/v1/customers/:id` | Atualizar cliente |
| GET | `/api/v1/customers/:id/history` | Histórico de atendimento |
| GET | `/api/v1/customers/plans` | Listar planos |
| POST | `/api/v1/customers/plans` | Criar plano |

### Chamados
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/tickets` | Listar com filtros e paginação |
| POST | `/api/v1/tickets` | Abrir chamado |
| GET | `/api/v1/tickets/stats` | Estatísticas |
| GET | `/api/v1/tickets/:id` | Detalhes do chamado |
| PATCH | `/api/v1/tickets/:id` | Atualizar status/responsável |
| POST | `/api/v1/tickets/:id/comments` | Adicionar comentário |

### Incidentes
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/incidents` | Listar incidentes |
| POST | `/api/v1/incidents` | Registrar incidente |
| GET | `/api/v1/incidents/:id` | Detalhes |
| PATCH | `/api/v1/incidents/:id/resolve` | Resolver incidente |

### Monitoramento
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/monitoring/overview` | Visão geral |
| POST | `/api/v1/monitoring/metrics` | Registrar métrica |
| GET | `/api/v1/monitoring/customers/:id/metrics` | Métricas do cliente |
| POST | `/api/v1/monitoring/simulate` | Simular métricas (dev) |

### Dashboard
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/dashboard` | KPIs e métricas |
| GET | `/api/v1/dashboard/charts` | Dados para gráficos |

### Notificações
| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/v1/notifications` | Listar notificações |
| GET | `/api/v1/notifications/unread-count` | Contagem não lidas |
| PATCH | `/api/v1/notifications/:id/read` | Marcar como lida |
| PATCH | `/api/v1/notifications/read-all` | Marcar todas como lidas |

---

## Fluxo de Autenticação

```
Cliente                    Backend                    Redis/DB
  │                           │                          │
  │──── POST /auth/login ─────►│                          │
  │                           │──── Valida credenciais ──►│
  │                           │◄─── User data ────────────│
  │                           │                          │
  │◄─── { accessToken,        │                          │
  │       refreshToken,       │──── Salva refreshToken ──►│
  │       user } ─────────────│                          │
  │                           │                          │
  │──── GET /api (Bearer) ────►│                          │
  │                           │──── Valida JWT ──────────►│
  │◄─── Response ─────────────│                          │
  │                           │                          │
  │  (token expirado)         │                          │
  │──── POST /auth/refresh ───►│                          │
  │                           │──── Valida refreshToken ─►│
  │◄─── { accessToken,        │                          │
  │       refreshToken } ─────│                          │
```

---

## Workflow de Chamados

```
ABERTO ──► EM_ANALISE ──► AGUARDANDO_CLIENTE
  │              │                │
  │              ▼                ▼
  │        EM_MANUTENCAO ◄────────┘
  │              │
  └──────────────▼
              RESOLVIDO ──► FECHADO
```

---

## Processamento Assíncrono (Filas)

```
Evento                    Fila              Processador
─────────────────────────────────────────────────────────
Chamado criado    ──►  notifications  ──►  Notifica cliente
Chamado atualizado──►  notifications  ──►  Notifica cliente
Incidente criado  ──►  incidents      ──►  Alerta admins (CRITICAL/HIGH)
Métrica offline   ──►  metrics        ──►  Alerta cliente e técnicos
```

---

## Modelagem do Banco de Dados

```
users ──────────────────────────────────────────────────────
  id, name, email, password, role, isActive, refreshToken

customers ──────────────────────────────────────────────────
  id, userId(FK), document, phone, address, city, state,
  zipCode, planId(FK), serviceStatus, contractStart

internet_plans ─────────────────────────────────────────────
  id, name, type, downloadSpeed, uploadSpeed, price, slaHours

tickets ────────────────────────────────────────────────────
  id, title, description, status, priority, customerId(FK),
  createdById(FK), assignedToId(FK), slaDeadline, resolvedAt

ticket_comments ────────────────────────────────────────────
  id, ticketId(FK), userId(FK), content, isInternal

ticket_history ─────────────────────────────────────────────
  id, ticketId(FK), fromStatus, toStatus, changedById, note

incidents ──────────────────────────────────────────────────
  id, title, description, severity, customerId(FK),
  isResolved, resolvedAt, affectedServices[]

service_metrics ────────────────────────────────────────────
  id, customerId(FK), latency, uptime, packetLoss,
  downloadSpeed, uploadSpeed, status, recordedAt

notifications ──────────────────────────────────────────────
  id, userId(FK), title, message, type, isRead
```

---

## Perfis e Permissões

| Recurso | ADMIN | TECNICO | CLIENTE |
|---|---|---|---|
| Usuários (CRUD) | ✅ | ❌ | ❌ |
| Clientes (CRUD) | ✅ | Leitura/Edição | Próprio |
| Chamados (criar) | ✅ | ✅ | ✅ |
| Chamados (atualizar status) | ✅ | ✅ | ❌ |
| Incidentes (criar) | ✅ | ✅ | ❌ |
| Monitoramento | ✅ | ✅ | Próprio |
| Dashboard | ✅ | ✅ | ❌ |
| Simular métricas | ✅ | ❌ | ❌ |

---

## Credenciais de Acesso (Seed)

| Perfil | Email | Senha |
|---|---|---|
| Admin | admin@netpulse.com | Admin@123 |
| Técnico | tecnico@netpulse.com | Tech@123 |
| Cliente | cliente@netpulse.com | Client@123 |

---

## Executar Testes

```bash
# Backend
cd backend
npm test
npm run test:cov

# Frontend
cd frontend
npm test
```

---

## Observabilidade

- **Correlation ID**: Cada requisição recebe um UUID único para rastreamento
- **Logs estruturados**: Método, URL, status code e tempo de resposta
- **Global Exception Filter**: Tratamento centralizado de erros com stack trace
- **Health Check**: `GET /health` verifica conectividade com o banco
- **Swagger UI**: Documentação interativa em `/api/docs`

---

## Padrões Aplicados

- **Clean Architecture**: Separação em Controllers → Services → Repositories
- **SOLID**: Single Responsibility, Dependency Injection via NestJS IoC
- **Repository Pattern**: Prisma como camada de acesso a dados
- **DDD básico**: Módulos por domínio (customers, tickets, incidents)
- **Design Patterns**: Strategy (JWT), Observer (filas), Decorator (guards)
