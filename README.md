# QuickBite

**A full-stack food delivery platform** serving Egypt and Saudi Arabia — inspired by Talabat and UberEats. Built with a clean-architecture backend (Express 5 + TypeScript) and a modern React 19 frontend, backed by PostgreSQL 16 with PostGIS and Redis 7.

---

## Tech Stack

| Layer                | Technologies                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| **Backend**          | TypeScript 6, Express 5, Node.js (ESM)                                       |
| **Frontend**         | React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Socket.IO Client             |
| **Database**         | PostgreSQL 16 + PostGIS 3.4                                                  |
| **Cache / Queue**    | Redis 7 (ioredis)                                                            |
| **ORM**              | Knex.js 3                                                                    |
| **DI**               | tsyringe                                                                     |
| **Auth**             | JWT (jsonwebtoken + bcrypt)                                                  |
| **Payments**         | Kashier (Egypt-based provider)                                               |
| **Email**            | Mailjet                                                                      |
| **Real-time**        | Socket.IO 4 + Redis adapter                                                  |
| **State**            | Zustand 5                                                                    |
| **API Client**       | Axios + TanStack React Query 5                                               |
| **Forms**            | react-hook-form + zod 4                                                      |
| **UI**               | Radix UI, shadcn, lucide-react                                               |
| **Infrastructure**   | Docker Compose (4 services: postgres, redis, backend, frontend)              |

---

## Architecture

### Backend — Clean Layered Architecture

```
routes → controller → service → repository
```

- **tsyringe** dependency injection with Symbol tokens
- **Express 5** middleware stack: helmet, cors, cookie-parser, correlation ID, structured JSON logger, unified error handler
- **RBAC** — AWS IAM-style `resource:action` permissions, Redis-cached (1 hour), `system_admin` bypass
- **Idempotency** — Redis `SET NX EX` lock pattern for POST/PATCH/PUT
- **Cursor-based pagination** for orders, restaurants, agents
- **Webhook deduplication** — DB `ON CONFLICT DO NOTHING` + Redis in-flight lock

### Frontend — Component-Driven SPA

- **Routing** — `createBrowserRouter` with lazy-loaded pages & role-based guards:
  - `GuestRoute` — redirects authenticated users to `/`
  - `ProtectedRoute` — checks `system_role`, redirects to role-appropriate home
- **State** — Zustand stores (`auth-store`, `cart-store` with localStorage persistence, `location-store`, `presence-store`, `active-restaurant-store`)
- **Server state** — TanStack React Query with automatic toast notifications (sonner)
- **API client** — Axios with Bearer interceptor + 401 auto-refresh
- **Real-time** — Socket.IO client with channel-based subscriptions per role (`customer:<id>`, `agent:<id>`, `restaurant:<id>`, `branch:<id>`); handles order updates, delivery offers, and assignment events
- **File uploads** — AWS S3 presigned URLs for direct browser-to-S3 image uploads
- **Mobile-responsive** — Sheet-based slide-in sidebars for restaurant and admin portals on small screens

---

## Database

### Key Entities

| Table                    | Notes                                                    |
| ------------------------ | -------------------------------------------------------- |
| `users`                  | `system_role`: customer, delivery_agent, restaurant_user, system_admin |
| `restaurants`            | Linked to owner; status: active, suspended, disabled, pending |
| `restaurant_branches`    | PostGIS `geography(Point,4326)` with GIST index, per-branch delivery_fee, currency, hours |
| `products`               | Soft-delete via `deleted_at`                             |
| `product_branch_details` | Per-branch price, stock, availability                    |
| `orders`                 | **Year-partitioned**; 11-state status lifecycle; minor-unit integers for all amounts |
| `order_items`            | Snapshot of name, price, image at order time             |
| `payment_sessions`       | JSONB payloads                                            |
| `payment_webhook_events` | UNIQUE(provider_id, provider_event_id) for dedup         |
| `restaurant_members`     | RBAC member-to-restaurant with branch scoping            |
| `agent_earnings`         | Per-order earnings                                       |
| `restaurant_balances`    | Compound key (restaurant_id, currency), atomic payouts   |

### Key Design Decisions

- **Minor-unit integers** for all prices, fees, balances — avoids floating-point errors
- **Commission** calculated as `branch.commission * subtotal / 10000` at order creation
- **Delivery fee** pulled from branch config at order time (not recalculated)
- **Service fee** — hardcoded as 10% of subtotal
- **PostGIS geography column** — `GENERATED ALWAYS AS ST_MakePoint(lng, lat)::geography STORED`
- **Order partitions** — `create-partitions.ts` creates yearly child tables

---

## Order Status Lifecycle

```
pending_payment → placed → accepted → preparing → ready → assigned → picked → delivered
                         → rejected     → cancelled (at various stages)
```

Enforced as a state machine — invalid transitions return errors.

---

## Real-time & Background Jobs

- **Socket.IO** server with Redis adapter, JWT handshake, role-based channels (`customer:<id>`, `agent:<id>`, `restaurant:<id>`, `branch:<id>`)
- **Frontend** subscribes to role-specific channels for live order updates, delivery offers (with countdown timers), and assignment events; includes audio notifications for new offers
- **Worker process** (`worker.ts`) — runs assignment cron job:
  1. Buffer ready orders from Redis list
  2. `GEORADIUS` search for nearby agents
  3. Socket.IO offer broadcast
  4. Claim lock via `trySet`
  5. Manual owner override support

---

## Modules

| Module               | Status | Description                                        |
| -------------------- | ------ | -------------------------------------------------- |
| Auth                 | ✅     | Register, login, refresh, OTP password reset       |
| Users                | ✅     | Profile management                                 |
| Customer Addresses   | ✅     | CRUD delivery addresses with geolocation           |
| Restaurants          | ✅     | Create, update, status management                  |
| Branches             | ✅     | CRUD, PostGIS nearby-search, status toggle         |
| Products             | ✅     | CRUD, categories, per-branch pricing/stock         |
| Orders               | ✅     | Place (stock lock, fee calc), list, status machine |
| Payments (Kashier)   | ✅     | HMAC-signed sessions, webhook processing           |
| RBAC / Members       | ✅     | Role/permission management, invitation email       |
| Delivery Agents      | ✅     | Presence (Redis Geo + Hash), task lifecycle        |
| Assignment           | ✅     | Geo-based order dispatching, offer/claim           |
| Finance              | ✅     | Balances, atomic payouts                           |
| S3 Uploads           | ✅     | Presigned URLs for direct browser-to-S3 uploads    |
| Health               | ✅     | Database health check endpoint                     |

---

## Frontend Pages

### Guest

| Page             | Route                   | Status | Description                                              |
| ---------------- | ----------------------- | ------ | -------------------------------------------------------- |
| Sign In          | `/auth/sign-in`         | ✅     | Email + password login                                   |
| Sign Up          | `/auth/sign-up`         | ✅     | Registration with role selection and conditional fields  |
| Forgot Password  | `/auth/forgot-password` | ✅     | OTP via email flow                                       |
| Reset Password   | `/auth/reset-password`  | ✅     | New password form with OTP token                         |

### Customer

| Page            | Route                    | Status | Description                                          |
| --------------- | ------------------------ | ------ | ---------------------------------------------------- |
| Home            | `/`                      | ✅     | Geo-location, zone selection, nearby branches grid   |
| Menu            | `/menu/:branchId`        | ✅     | Branch header, categories, product cards, cart sheet |
| Checkout        | `/checkout`              | ✅     | Order type, address, payment method, Kashier redirect|
| Orders          | `/orders`                | ✅     | Infinite scroll, year filter, cursor pagination      |
| Order Detail    | `/orders/:publicId`      | ✅     | Items, prices, status timeline with icons            |
| Profile         | `/profile`               | ✅     | Personal info, address CRUD with dialogs             |

### Delivery Agent

| Page            | Route       | Status | Description                                                          |
| --------------- | ----------- | ------ | -------------------------------------------------------------------- |
| Dashboard       | `/delivery` | ✅     | Go online/offline, real-time offer notifications with countdown, task management (accept/reject/pick up/deliver), earnings wallet, payout history |

### Restaurant Portal

| Page            | Route                          | Status | Description                                                          |
| --------------- | ------------------------------ | ------ | -------------------------------------------------------------------- |
| Orders          | `/restaurant/orders`           | ✅     | Status filter tabs, infinite scroll, accept/reject/prepare/ready, agent assignment, real-time updates |
| Order Detail    | `/restaurant/orders/:publicId` | ✅     | Order items, status timeline                                         |
| Products        | `/restaurant/products`         | ✅     | Product grid with images, per-branch pricing/stock, create/edit dialogs |
| Branches        | `/restaurant/branches`         | ✅     | Branch cards with hours, delivery fee, pause/resume toggle           |
| Members         | `/restaurant/members`          | ✅     | Member list per branch, invite/edit/delete, role badges              |
| Settings        | `/restaurant/settings`         | ✅     | Restaurant profile editing, logo upload via S3 presigned URL         |
| Finance         | `/restaurant/finance`          | ✅     | Wallet balance per currency, payout history                          |

### Admin Portal

| Page             | Route                                    | Status | Description                                                          |
| ---------------- | ---------------------------------------- | ------ | -------------------------------------------------------------------- |
| Restaurants      | `/admin/restaurants`                     | ✅     | Paginated restaurant list with status filters, status management     |
| Restaurant Detail| `/admin/restaurants/:restaurantId`       | ✅     | Branch list, balance per currency, commission config, payout creation |
| Agents           | `/admin/agents`                          | ✅     | Delivery agent list                                                  |
| Agent Detail     | `/admin/agents/:agentId`                 | ✅     | Agent balance, payout history, payout creation                       |

---

## Getting Started

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- npm

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Key variables needed:
- **JWT** — `ACCESS_SECRET`, `REFRESH_SECRET`
- **PostgreSQL** — connection credentials
- **Redis** — host, port, password
- **Mailjet** — API key & secret for transactional emails
- **Kashier** — merchant credentials for payment processing

### Development

```bash
# Start infrastructure (PostgreSQL + Redis)
docker compose up -d postgres redis

# Backend (http://localhost:3000)
cd backend
npm install
npm run migrate:latest:dev
npm run dev

# Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

### Production

```bash
docker compose up --build -d
```

Exposes: Frontend on port `80`, Backend on port `3000`.

### Scripts

| Script                       | Directory | Description                                   |
| ---------------------------- | --------- | --------------------------------------------- |
| `npm run dev`                | backend   | Start dev server with tsx watch                |
| `npm run dev:all`            | backend   | Start both API server + worker with tsx watch  |
| `npm run build`              | backend   | Compile TypeScript                             |
| `npm run start`              | backend   | Start production API server                    |
| `npm run start:all`          | backend   | Start API + worker via PM2                     |
| `npm run lint` / `lint:fix`  | backend   | ESLint                                         |
| `npm run format`             | backend   | Prettier formatting                            |
| `npm run migrate:latest:dev` | backend   | Run knex migrations (dev)                      |
| `npm run migrate:make`       | backend   | Create new migration                           |
| `npm run migrate:rollback`   | backend   | Rollback last migration                        |
| `npm run dev`                | frontend  | Vite dev server                                |
| `npm run build`              | frontend  | TypeScript + Vite production build             |
| `npm run lint`               | frontend  | ESLint                                         |
| `npm run preview`            | frontend  | Preview production build locally               |

---

## Project Structure

```
quickbite/
├── backend/
│   ├── src/
│   │   ├── app/          # Feature modules (auth, users, orders, etc.)
│   │   ├── lib/          # Knex, Redis, config, middleware, types
│   │   ├── migrations/   # Knex migration files
│   │   └── scripts/      # Utility scripts (partition creation)
│   ├── server.ts         # Entry point
│   └── worker.ts         # Background job worker
├── frontend/
│   ├── src/
│   │   ├── api/          # API client setup
│   │   ├── components/   # Shared UI components (shadcn)
│   │   ├── features/     # Page-level components & views
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # Auth, app, admin, delivery, restaurant layouts
│   │   ├── lib/          # Utilities, formatters, CN helper
│   │   ├── routes/       # Route definitions & guards
│   │   └── store/        # Zustand stores
│   └── nginx.conf        # Nginx config for production
├── docker-compose.yml    # Infrastructure orchestration
└── README.md
```

---

## API Overview

The backend exposes a RESTful API with the following patterns:

- **Base URL**: `http://localhost:3000/api/v1`
- **Auth**: Bearer token in `Authorization` header; refresh token in cookie
- **Idempotency**: Send `Idempotency-Key` header on POST/PATCH/PUT
- **Pagination**: Cursor-based via `cursor` and `limit` query params
- **Errors**: Consistent JSON envelope with `status`, `message`, `code`
- **WebSocket**: Socket.IO at `/ws`

---

## License

MIT
