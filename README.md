# TechNova Backend (NestJS + TypeORM + PostgreSQL)

This repository contains the backend for TechNova, a tech products company that needs to centralize and secure management of products, users, and basic orders. It follows a modular NestJS architecture with strict typing, validation, and JWT-based authentication.

## Stack

- NestJS 11, TypeScript, class-validator
- TypeORM 0.3.x with PostgreSQL
- JWT auth with Passport (local + JWT strategies)

## Architecture

- `src/app.module.ts`: Root module, wires modules.
- `src/config/typeorm.Connection.config.ts`: TypeORM options (uses DB URL).
- `src/config/configVariables.ts`: Loads `.env` variables.
- `src/modules/products/`: Product entity, DTOs, service, controller.
- `src/modules/users/`: User entity, DTO, service, controller.
- `src/modules/auth/`: Auth module, controller, service, local/jwt strategies.
- `src/common/guards/jwt-auth.guard.ts`: JWT guard wrapper.
- `src/common/decorators/filters/http-exception.filter.ts`: Global error filter (optional to register).

## Database Schema Alignment

Matches existing PostgreSQL tables and snake_case columns:

- `users(id, username, email, password, role, is_active, created_at)`
- `products(id, sku, name, brand, quantity, price, is_active, category, image_url, create_at, user_id)`

See:
- `src/modules/users/entitites/user.entity.ts`
- `src/modules/products/entities/product.entity.ts`

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+

### Environment

Create `.env` with a Postgres URL and settings:

```
DB_CONNECTION=postgres://<user>:<password>@<host>:5432/<database>
DB_SYNC=true
DB_LOGGING=true
DB_SSL=false
DB_SSL_REJECT_UNAUTHORIZED=false

PORT=3000

JWT_SECRET=change_me
JWT_EXPIRES_IN=3600
```

> The app requires `DB_CONNECTION`. The config validates the URL and prints a sanitized summary at startup.

### Install

```bash
npm install
# Auth dependencies
npm i @nestjs/passport passport passport-local passport-jwt
```

### Run

```bash
npm run start:dev
```

You should see DB config logs and a success connection message if the database exists and credentials are valid.

## API Overview

### Auth

- `POST /auth/login` with body `{ "username": string, "password": string }`
  - Uses Local strategy.
  - Returns `{ access_token, user }` (JWT in Bearer format).

### Products

- `POST /products` create product (validates unique SKU).
- `GET /products` list with optional filters `brand`, `category`, pagination `page`, `limit` (excludes soft-deleted).
- `GET /products/:id` get by id.
- `PATCH /products/:id` update (re-validates SKU uniqueness when changed).
- `PUT /products/:id` replace (same update path under the hood).
- `DELETE /products/:id` soft-delete (sets `is_active=false`).

Entity/DTOs: `src/modules/products/entities/*`.

### Users

- `POST /users` create user (password hashed on save).
- `GET /users` list users.
- `GET /users/search?username=...` filter by username.
- `GET /users/:id` get by id.
- `PATCH /users/:id` partial update (re-hashes password if provided).
- `PUT /users/:id` replace (same update path under the hood).
- `DELETE /users/:id` delete user.

## Validation & Error Handling

- Global `ValidationPipe` with `whitelist` and `forbidNonWhitelisted` in `src/main.ts`.
- Optional global exception filter `AllExceptionsFilter` in `src/common/decorators/filters/http-exception.filter.ts`.
  - To enable globally, register in `src/main.ts`:

```ts
import { AllExceptionsFilter } from './common/decorators/filters/http-exception.filter';
// ... after creating app
app.useGlobalFilters(new AllExceptionsFilter());
```

## Notes

- **DB must exist**: ensure the database named in `DB_CONNECTION` exists and is reachable.
- **Passwords hashed**: `UsersService` stores passwords hashed with `bcrypt` (salt 10). `AuthService` validates with `bcrypt.compare()`.
- **Soft-delete**: `DELETE /products/:id` sets `is_active=false`. `GET /products` excludes soft-deleted by default.
- **Auth**: Add `@UseGuards(JwtAuthGuard)` on routes you want protected.
