# TaskFlow ⚡

A modern, full-stack **Task Management System** built with a glassmorphism design language. Clean architecture, secure JWT authentication, and a responsive UI that works beautifully on every screen size.

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

### Backend
- **JWT Auth** — Short-lived access tokens (15m) + rotating refresh tokens (7d)
- **Bcrypt** — Password hashing with a cost factor of 12
- **Full Task CRUD** — Create, read, update, delete, and toggle task status
- **Advanced Querying** — Pagination, full-text search, filtering by status/priority, multi-field sorting
- **Input Validation** — express-validator on every route with descriptive error messages
- **Security** — Helmet headers, CORS whitelisting, httpOnly cookie for refresh token

### Frontend
- **Glassmorphism UI** — Frosted-glass cards with ambient gradient orbs and a subtle grid overlay
- **Auth Flow** — Register / Login with Zod validation; automatic token refresh via Axios interceptor
- **Task Dashboard** — Live stats, filter bar (search + status + priority + sort), animated task cards
- **Responsive** — Mobile-first, works on all breakpoints
- **Toast Notifications** — Success/error feedback on every action
- **Zustand** — Lightweight global auth state with persistence

---

## 🗂 Project Structure

```
taskflow/
├── backend/                  # Node.js + TypeScript API
│   └── src/
│       ├── config/           # Environment config
│       ├── controllers/      # Route handlers
│       ├── middleware/       # Auth guard + validation runner
│       ├── prisma/           # Schema (User, Task, RefreshToken)
│       ├── routes/           # Express routers
│       ├── services/         # Business logic layer
│       ├── types/            # Shared TypeScript interfaces
│       └── index.ts          # App entry point
│
└── frontend/                 # Next.js 14 App Router
    └── src/
        ├── app/
        │   ├── (auth)/       # Login & Register pages
        │   ├── dashboard/    # Main task dashboard
        │   ├── globals.css   # Tailwind + glass utility classes
        │   └── layout.tsx    # Root layout with Toaster
        ├── components/
        │   ├── layout/       # Navbar
        │   └── tasks/        # TaskCard, TaskFormModal, Filters, Pagination, Stats
        ├── hooks/            # useTasks — all task operations in one place
        ├── lib/              # Axios instance with interceptors, utility helpers
        ├── store/            # Zustand auth store
        └── types/            # Shared TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

Copy and configure the environment file:

```bash
cp .env.example .env
```

Edit `.env` — the defaults work for local development, but **change the JWT secrets** before deploying:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
CLIENT_URL=http://localhost:3000
JWT_ACCESS_SECRET=change-me-to-something-strong
JWT_REFRESH_SECRET=change-me-to-something-strong
```

Generate the Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

Start the dev server:

```bash
npm run dev
# API running at http://localhost:4000
```

---

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a local environment file:

```bash
echo 'NEXT_PUBLIC_API_URL=http://localhost:4000/api' > .env.local
```

Start Next.js:

```bash
npm run dev
# App running at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000), register an account, and start managing tasks.

---

## 🔌 API Reference

### Auth

| Method | Endpoint           | Auth | Description                        |
|--------|--------------------|------|------------------------------------|
| POST   | `/api/auth/register` | —   | Register a new user                |
| POST   | `/api/auth/login`    | —   | Login and receive tokens           |
| POST   | `/api/auth/refresh`  | —   | Rotate refresh token               |
| POST   | `/api/auth/logout`   | —   | Revoke refresh token               |
| GET    | `/api/auth/me`       | ✓   | Get the authenticated user         |

### Tasks

| Method | Endpoint                | Auth | Description                                |
|--------|-------------------------|------|--------------------------------------------|
| GET    | `/api/tasks`            | ✓    | List tasks (paginated, filterable)         |
| POST   | `/api/tasks`            | ✓    | Create a task                              |
| GET    | `/api/tasks/stats`      | ✓    | Get task counts by status                  |
| GET    | `/api/tasks/:id`        | ✓    | Get a single task                          |
| PATCH  | `/api/tasks/:id`        | ✓    | Update a task                              |
| DELETE | `/api/tasks/:id`        | ✓    | Delete a task                              |
| PATCH  | `/api/tasks/:id/toggle` | ✓    | Toggle between PENDING ↔ COMPLETED         |

#### Query Parameters for `GET /api/tasks`

| Param    | Type                                   | Default      | Description              |
|----------|----------------------------------------|--------------|--------------------------|
| page     | number                                 | 1            | Page number              |
| limit    | number (max 50)                        | 10           | Items per page           |
| search   | string                                 | —            | Search title/description |
| status   | PENDING \| IN_PROGRESS \| COMPLETED   | —            | Filter by status         |
| priority | LOW \| MEDIUM \| HIGH                  | —            | Filter by priority       |
| sortBy   | createdAt \| dueDate \| priority \| title | createdAt | Sort field            |
| order    | asc \| desc                            | desc         | Sort direction           |

---

## 🛠 Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Backend     | Node.js, Express, TypeScript             |
| ORM         | Prisma (SQLite dev / PostgreSQL prod)    |
| Auth        | JWT (jsonwebtoken), bcryptjs             |
| Validation  | express-validator                        |
| Frontend    | Next.js 14 (App Router), TypeScript      |
| Styling     | Tailwind CSS (custom glassmorphism theme)|
| State       | Zustand                                  |
| Forms       | React Hook Form + Zod                    |
| HTTP client | Axios (with interceptor-based refresh)   |
| Animations  | Framer Motion                            |
| Toasts      | react-hot-toast                          |

---

## 🌐 Deployment

### Backend → Railway / Render

1. Set `DATABASE_URL` to a PostgreSQL connection string
2. Update `prisma/schema.prisma` datasource provider to `"postgresql"`
3. Run `npx prisma migrate deploy` as a release command

### Frontend → Vercel

```bash
cd frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your deployed backend URL in Vercel's environment settings.

---

## 📄 License

MIT © 2024
