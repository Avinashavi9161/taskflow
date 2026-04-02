# TaskFlow ⚡

A full-stack task management system with a glassmorphism UI, secure JWT authentication, and a clean REST API. Built with Node.js, Next.js, and TypeScript.

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | https://taskflow-kappa-rouge.vercel.app |
| Backend API | https://taskflow-q8q4.onrender.com |
| Health Check | https://taskflow-q8q4.onrender.com/health |
| Repository | https://github.com/Avinashavi9161/taskflow |

> The backend is hosted on Render's free tier. The first request after inactivity may take ~30 seconds to wake up.

---

## ✨ Features

**Authentication**
- Register and login with email and password
- JWT access tokens (15m) with rotating refresh tokens (7d)
- Passwords hashed with bcrypt before storage
- Silent token refresh via Axios interceptor — no unexpected logouts

**Task Management**
- Create, edit, delete and toggle task status
- Three status levels — pending, in progress, completed
- Priority levels — low, medium, high
- Due date support with overdue detection

**Dashboard**
- Live stats showing task counts per status
- Search by title, filter by status or priority
- Sort by date, due date, priority or title
- Paginated task list
- Toast notifications on every action
- Fully responsive — works on mobile and desktop

---

## 🛠 Tech Stack

**Backend**

| Technology | Purpose |
|---|---|
| Node.js + Express | Server and routing |
| TypeScript | Type safety |
| Prisma ORM | Database access |
| PostgreSQL | Database (Railway) |
| JWT + bcrypt | Auth and password hashing |
| express-validator | Input validation |
| Helmet + CORS | Security headers |

**Frontend**

| Technology | Purpose |
|---|---|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling with glassmorphism theme |
| Zustand | Global auth state |
| React Hook Form + Zod | Form handling and validation |
| Axios | HTTP client with interceptors |
| react-hot-toast | Toast notifications |

---

## 🗂 Project Structure

```
taskflow/
├── backend/
│   └── src/
│       ├── config/           environment and constants
│       ├── controllers/      request handlers
│       ├── middleware/       auth guard, input validation
│       ├── prisma/           database schema
│       ├── routes/           express routers
│       ├── services/         business logic layer
│       └── types/            shared TypeScript interfaces
│
└── frontend/
    └── src/
        ├── app/              Next.js pages and layouts
        ├── components/       UI components
        ├── hooks/            useTasks data hook
        ├── lib/              axios instance, utilities
        ├── store/            Zustand auth store
        └── types/            shared TypeScript types
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+

**1. Clone the repo**

```bash
git clone https://github.com/Avinashavi9161/taskflow.git
cd taskflow
```

**2. Set up the backend**

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env`. Generate strong JWT secrets with `openssl rand -base64 64`, then:

```bash
npm run db:generate
npm run db:migrate
npm run dev
```

API runs at `http://localhost:4000`.

**3. Set up the frontend**

```bash
cd frontend
npm install
echo 'NEXT_PUBLIC_API_URL=http://localhost:4000/api' > .env.local
npm run dev
```

App runs at `http://localhost:3000`. Register an account and start managing tasks.

---

## 🔌 API Reference

**Auth routes** — no token required

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | create a new account |
| POST | `/api/auth/login` | sign in and receive tokens |
| POST | `/api/auth/refresh` | rotate the refresh token |
| POST | `/api/auth/logout` | revoke the refresh token |
| GET | `/api/auth/me` | get the current user |

**Task routes** — Bearer token required

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | list tasks (paginated) |
| POST | `/api/tasks` | create a task |
| GET | `/api/tasks/stats` | get counts by status |
| GET | `/api/tasks/:id` | get a single task |
| PATCH | `/api/tasks/:id` | update a task |
| DELETE | `/api/tasks/:id` | delete a task |
| PATCH | `/api/tasks/:id/toggle` | toggle task status |

**Query params for `GET /api/tasks`**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | page number |
| limit | number | 10 | items per page (max 50) |
| search | string | — | search title and description |
| status | PENDING / IN_PROGRESS / COMPLETED | — | filter by status |
| priority | LOW / MEDIUM / HIGH | — | filter by priority |
| sortBy | createdAt / dueDate / priority / title | createdAt | sort field |
| order | asc / desc | desc | sort direction |

---

## ⚙️ Environment Variables

**Backend** — all variables are documented in `.env.example`

```env
DATABASE_URL=
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Frontend**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🌍 Deployment

| Layer | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://taskflow-kappa-rouge.vercel.app |
| Backend | Render | https://taskflow-q8q4.onrender.com |
| Database | Railway | PostgreSQL |

**Render — backend settings**

Root directory: `backend`

Build command:
```bash
npm install --include=dev && npx prisma generate && npx prisma db push && npm run build
```

Start command:
```bash
node dist/index.js
```

**Vercel — frontend settings**

Root directory: `frontend`

Add environment variable `NEXT_PUBLIC_API_URL` pointing to your Render backend URL.

---

## 📄 License

MIT © 2024 Avinash Kumar Gupta
