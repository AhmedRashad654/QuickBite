# QuickBite

**A full-stack food delivery platform** serving Egypt and Saudi Arabia — inspired by Talabat and UberEats. Built with a clean-architecture backend (Express 5 + TypeScript) and a modern React 19 frontend, backed by PostgreSQL 16 with PostGIS and Redis 7.

---

## Tech Stack

| Layer                | Technologies                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| **Backend**          | TypeScript 6, Express 5, Node.js (ESM)                                       |
| **Frontend**         | React 19, TypeScript 6, Vite 8, Tailwind CSS 4                               |
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
- **State** — Zustand stores (`auth-store`, `cart-store` with localStorage persistence, `location-store`)
- **Server state** — TanStack React Query with automatic toast notifications (sonner)
- **API client** — Axios with Bearer interceptor + 401 auto-refresh

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
| Delivery Agents      | ✅     | Presence (Redis Geo + Hash), task lifecycle       |
| Assignment           | ✅     | Geo-based order dispatching, offer/claim          |
| Finance              | ✅     | Balances, atomic payouts                           |

---

## Frontend Pages

| Page            | Role     | Status | Description                                          |
| --------------- | -------- | ------ | ---------------------------------------------------- |
| Sign In / Up    | Guest    | ✅     | Email + password; role selection with conditional fields |
| Forgot / Reset  | Guest    | ✅     | OTP via email flow                                   |
| Home            | Customer | ✅     | Geo-location, zone selection, nearby branches grid   |
| Menu            | Customer | ✅     | Branch header, categories, product cards, cart sheet |
| Checkout        | Customer | ✅     | Order type, address, payment method, Kashier redirect |
| Orders          | Customer | ✅     | Infinite scroll, year filter, cursor pagination      |
| Order Detail    | Customer | ✅     | Items, prices, status timeline with icons            |
| Profile         | Customer | ✅     | Personal info, address CRUD with dialogs             |
| Delivery Portal | Agent    | 🚧     | Coming Soon — task list, offers, earnings            |
| Restaurant Portal | Staff  | 🚧     | Coming Soon — orders, products, branches, finance    |

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

| Script                    | Directory | Description                        |
| ------------------------- | --------- | ---------------------------------- |
| `npm run dev`             | backend   | Start dev server with tsx watch     |
| `npm run build`           | backend   | Compile TypeScript                  |
| `npm run migrate:latest:dev` | backend | Run knex migrations (dev)           |
| `npm run dev`             | frontend  | Vite dev server                     |
| `npm run build`           | frontend  | TypeScript + Vite production build  |

---

## Project Structure

```
quickbite/
├── backend/
│   ├── src/
│   │   ├── lib/          # Knex, Redis, config, middleware, types
│   │   ├── modules/      # Feature modules (auth, users, orders, etc.)
│   │   └── scripts/      # Utility scripts (partition creation)
│   ├── migrations/       # Knex migration files
│   ├── server.ts         # Entry point
│   └── worker.ts         # Background job worker
├── frontend/
│   ├── src/
│   │   ├── api/          # API client setup
│   │   ├── components/   # Shared UI components (shadcn)
│   │   ├── features/     # Page-level components & views
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # App, delivery, restaurant layouts
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
