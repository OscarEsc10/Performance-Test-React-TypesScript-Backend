# TechNova Backend (NestJS + TypeORM + PostgreSQL)

This repository contains the backend for TechNova, a tech products company that needs to centralize and secure management of products, users, and basic orders. It follows a modular NestJS architecture with strict typing, validation, and JWT-based authentication.

## Stack

- NestJS 11, TypeScript, class-validator
- TypeORM 0.3.x with PostgreSQL
- JWT auth with Passport (local + JWT strategies)

## Architecture

- `src/app.module.ts`: Root module, wires modules.
- `src/config/typeorm.config.ts`: URL-only DB connection with clear validation/logs.
- `src/modules/products/`: Product entity, DTOs, service, controller.
- `src/modules/users/`: User entity, DTO, service, controller.
- `src/modules/auth/`: Auth module, controller, service, local/jwt strategies.
- `src/common/guards/jwt-auth.guard.ts`: JWT guard wrapper.
- `src/common/decorators/filters/http-exception.filter.ts`: Global error filter (optional to register).

## Database Schema Alignment

Matches existing PostgreSQL tables and snake_case columns:

- `users(id, username, email, password, role, is_active, created_at)`
- `products(id, sku, name, brand, quantity, price, is_active, category, image_url, create_at)`

See:
- `src/modules/users/entitites/user.entity.ts`
- `src/modules/products/entities/product.entity.ts`

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 13+

### Environment

Create `.env` with a Postgres URL and JWT settings:

```
DB_CONNECTION=postgres://<user>:<password>@<host>:5432/<database>
JWT_SECRET=change_me
JWT_EXPIRES_IN=3600
PORT=3000
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
- `GET /products` list with optional filters `brand`, `category`, pagination `page`, `limit`.
- `PATCH /products/:id` update (re-validates SKU uniqueness when changed).
- `DELETE /products/:id` soft-delete (sets `is_active=false`).

Entity/DTOs: `src/modules/products/entities/*`.

### Users

- `POST /users` create user (decorator sets defaults, password hashing recommended).
- Planned: list, findByName, update, remove (add in `users.controller.ts` and `user.service.ts`).

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

- Ensure the database mentioned in the URL exists.
- Users passwords should be stored hashed. `AuthService` compares using `bcrypt`; update `UsersService.create()` to hash on save.
- Protect routes with `JwtAuthGuard` as needed.

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
