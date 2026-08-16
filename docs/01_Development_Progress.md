# Enterprise Node.js Platform — Development Progress

## Project

**Repository:** enterprise-node-platform

Production-grade enterprise Node.js microservice starter platform.

---

# Current Status

**Current Phase:** Phase 2.6 (planned)

**Completed:** Phase 0 → Phase 2.5

---

# Technology Stack

## Backend

* Node.js 24.x LTS
* TypeScript
* Fastify
* PostgreSQL
* MongoDB
* Redis
* Redpanda / Kafka
* Prisma ORM
* Mongoose
* Zod
* JWT
* Argon2
* Pino Logger

## Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* React Query

## Infrastructure

* Docker
* Docker Compose
* pnpm Workspaces
* TurboRepo
* GitHub Actions

---

# Monorepo Structure

apps/
api-gateway/
auth-service/
user-service/
notification-service/
web/

packages/
auth/
config/
kafka/
logger/
observability/
shared/
types/
validation/

docs/
infrastructure/
scripts/

---

# Docker Infrastructure

docker-compose.yml provides:

| Service    | Container         | Host Port |
| ---------- | ----------------- | --------- |
| PostgreSQL | platform-postgres | 5433      |
| MongoDB    | platform-mongodb  | 27017     |
| Redis      | platform-redis    | 6379      |
| Redpanda   | platform-redpanda | 9092      |

PostgreSQL URL

postgresql://platform:platform@127.0.0.1:5433/platform

---

# Environment Files

Auth Service

apps/auth-service/.env

API Gateway

apps/api-gateway/.env

---

# Completed Phases

## Phase 0

* Repository architecture
* Folder structure
* Technology decisions
* Development roadmap

## Phase 1

* GitHub repository setup
* pnpm workspace
* TurboRepo
* ESLint
* Prettier
* Husky
* lint-staged
* Commitlint
* EditorConfig
* Makefile
* Base TypeScript configuration

## Phase 2.1

Shared packages created

* @platform/config
* @platform/logger
* @platform/types
* @platform/shared
* @platform/validation
* @platform/auth

## Phase 2.2

Auth Service

* Fastify bootstrap
* Prisma integration
* PostgreSQL
* Health endpoint
* Readiness endpoint
* Structured logging
* Correlation IDs

## Phase 2.3

Authentication

* Register
* Login
* Password hashing (Argon2)
* JWT access tokens
* Refresh tokens
* Repository pattern
* Service layer
* Zod validation

## Phase 2.4

API Gateway

* Fastify gateway
* Reverse proxy
* Helmet
* CORS
* Correlation ID propagation
* Health endpoints
* Gateway routing

## Phase 2.5

Gateway Authentication

* JWT verification middleware
* Protected routes
* Shared auth package
* Fastify request augmentation
* Service-specific configuration loaders

---

# Configuration Architecture

packages/config/src

config.ts
auth-config.ts
gateway-config.ts
index.ts

Usage

Auth Service

loadAuthConfig()

API Gateway

loadGatewayConfig()

Shared utilities

loadConfig()

---

# Install Commands

Install all workspace dependencies

pnpm install

---

# Docker Commands

Start infrastructure

docker compose up -d

Stop infrastructure

docker compose down

View running containers

docker ps

View logs

docker compose logs -f

---

# Build Commands

Build all packages

pnpm build

Build config package

pnpm --filter @platform/config build

Build logger package

pnpm --filter @platform/logger build

Build auth package

pnpm --filter @platform/auth build

Build auth service

pnpm --filter auth-service build

Build API Gateway

pnpm --filter api-gateway build

---

# Development Commands

Run Auth Service

pnpm --filter auth-service dev

Run API Gateway

pnpm --filter api-gateway dev

Run frontend

pnpm --filter web dev

---

# Typecheck Commands

Typecheck all

pnpm typecheck

Typecheck Auth Service

pnpm --filter auth-service typecheck

Typecheck API Gateway

pnpm --filter api-gateway typecheck

Typecheck config package

pnpm --filter @platform/config typecheck

---

# Prisma Commands

Generate client

pnpm --filter auth-service prisma:generate

Create migration

pnpm --filter auth-service prisma:migrate -- --name migration_name

Push schema

pnpm --filter auth-service prisma:push

Open Prisma Studio

pnpm --filter auth-service prisma:studio

---

# Current Ports

| Service              | Port           |
| -------------------- | -------------- |
| API Gateway          | 3000           |
| Auth Service         | 4001           |
| User Service         | 4002 (planned) |
| Notification Service | 4003 (planned) |
| PostgreSQL           | 5433           |
| MongoDB              | 27017          |
| Redis                | 6379           |
| Kafka                | 9092           |

---

# Implemented Authentication Flow

Register

POST /auth/register

Login

POST /auth/login

Protected Route

GET /me

Gateway verifies JWT before protected routes.

---

# Next Phase

## Phase 2.6

Refresh Token Rotation and Session Management

Planned

* Redis integration
* Session model
* Session repository
* Session service
* Refresh token rotation
* Token family tracking
* Replay attack detection
* Logout
* Logout all
* Session listing API
* Redis session caching

---

# Engineering Notes

* Docker PostgreSQL is used instead of local PostgreSQL.
* All services are designed for independent deployment.
* API Gateway is the only public entry point.
* Shared packages are consumed through workspace:* dependencies.
* The architecture is AWS-ready for future ECS/RDS/MSK migration.

---

Last Updated

Phase 2.5 completed
Ready to begin Phase 2.6.1
