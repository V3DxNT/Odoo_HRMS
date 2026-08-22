# Dayflow — System Architecture Document

**Version:** 1.0
**Companion to:** PRD.md

---

## 1. Tech Stack Summary

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) — monorepo, frontend + backend in one deployable unit |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (access + refresh tokens) via httpOnly cookies |
| File Storage | Cloudinary (profile pictures, documents) |
| AI | Gemini API (chatbot, summarization, anomaly insights) |
| Hosting | Vercel (Serverless Functions + Edge where applicable) |
| Email | Transactional email provider (e.g., Resend) for verification/notifications |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           VERCEL EDGE                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Next.js App (Monorepo)                    │  │
│  │                                                               │
│  │  ┌─────────────────┐        ┌──────────────────────────┐  │  │
│  │  │   App Router     │        │   API Route Handlers      │  │  │
│  │  │  (RSC + Client   │◄──────►│   /app/api/**             │  │  │
│  │  │   Components)    │  fetch │   (Serverless Functions)  │  │  │
│  │  └─────────────────┘        └────────────┬─────────────┘  │  │
│  │                                            │                 │  │
│  │  ┌─────────────────┐        ┌──────────────▼─────────────┐  │  │
│  │  │ Middleware       │        │  Prisma Client              │  │  │
│  │  │ (JWT verify,     │        │  (Service Layer)            │  │  │
│  │  │  RBAC guard)     │        └──────────────┬─────────────┘  │  │
│  │  └─────────────────┘                        │                 │  │
│  └───────────────────────────────────────────┬─┴─────────────────┘  │
└──────────────────────────────────────────────┼──────────────────────┘
                                                 │
                 ┌───────────────────────────────┼───────────────────────┐
                 │                               │                       │
        ┌────────▼────────┐          ┌───────────▼──────────┐  ┌────────▼────────┐
        │  PostgreSQL (DB)  │          │   Cloudinary (Media)  │  │  Gemini API (AI)  │
        │  Neon / Supabase  │          │   Images & Documents   │  │  Chat + Summaries │
        └───────────────────┘          └────────────────────────┘  └───────────────────┘
                                                 │
                                        ┌────────▼─────────┐
                                        │  Email Provider    │
                                        │  (Verification /   │
                                        │   Notifications)    │
                                        └─────────────────────┘
```

**Design principle:** Everything lives in one Next.js codebase — UI (React Server/Client Components), API (Route Handlers), and data access (Prisma) — deployed as a single Vercel project. No separate backend service.

---

## 3. Monorepo Structure

```
dayflow/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx                # Landing page
│   │   │   ├── pricing/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.tsx
│   │   │   ├── sign-up/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── layout.tsx
│   │   ├── onboarding/
│   │   │   ├── page.tsx                # Multi-step onboarding wizard
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx              # Auth-guarded shell
│   │   │   ├── employee/
│   │   │   │   ├── page.tsx            # Employee dashboard
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── attendance/page.tsx
│   │   │   │   ├── leave/page.tsx
│   │   │   │   └── payslips/page.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx            # Admin dashboard
│   │   │       ├── employees/page.tsx
│   │   │       ├── employees/[id]/page.tsx
│   │   │       ├── attendance/page.tsx
│   │   │       ├── leave-approvals/page.tsx
│   │   │       ├── payroll/page.tsx
│   │   │       └── reports/page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── sign-up/route.ts
│   │       │   ├── sign-in/route.ts
│   │       │   ├── sign-out/route.ts
│   │       │   ├── refresh/route.ts
│   │       │   └── verify-email/route.ts
│   │       ├── onboarding/
│   │       │   ├── invite/route.ts
│   │       │   └── complete/route.ts
│   │       ├── employees/
│   │       │   ├── route.ts            # GET (list, admin) / POST
│   │       │   └── [id]/route.ts       # GET/PATCH/DELETE
│   │       ├── attendance/
│   │       │   ├── check-in/route.ts
│   │       │   ├── check-out/route.ts
│   │       │   └── route.ts
│   │       ├── leave/
│   │       │   ├── route.ts            # apply / list
│   │       │   └── [id]/approve/route.ts
│   │       ├── payroll/
│   │       │   └── [employeeId]/route.ts
│   │       ├── uploads/
│   │       │   └── cloudinary-sign/route.ts
│   │       ├── ai/
│   │       │   ├── chat/route.ts
│   │       │   ├── summarize-leave/route.ts
│   │       │   └── attendance-insights/route.ts
│   │       └── notifications/route.ts
│   ├── components/
│   │   ├── ui/                          # Buttons, Cards, Modals, Inputs (Tailwind)
│   │   ├── motion/                      # Framer Motion wrappers (PageTransition, FadeIn)
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   └── landing/
│   ├── lib/
│   │   ├── prisma.ts                    # Prisma client singleton
│   │   ├── auth/
│   │   │   ├── jwt.ts                   # sign/verify access & refresh tokens
│   │   │   ├── cookies.ts               # httpOnly cookie helpers
│   │   │   └── rbac.ts                  # role guard helpers
│   │   ├── cloudinary.ts
│   │   ├── gemini.ts                    # Gemini API client wrapper
│   │   ├── email.ts
│   │   └── validators/                  # Zod schemas per feature
│   ├── middleware.ts                    # Route protection + role redirects
│   └── types/
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Authentication & Authorization Flow

### 4.1 Token Strategy
- **Access Token (JWT):** short-lived (15 min), contains `{ userId, role, iat, exp }`, stored in an httpOnly, Secure, SameSite=Strict cookie (`dayflow_access`).
- **Refresh Token:** long-lived (7 days), opaque or JWT, stored in a separate httpOnly cookie (`dayflow_refresh`), also persisted (hashed) in the `RefreshToken` DB table for revocation support.
- Access tokens are verified on every protected request via `middleware.ts`; refresh happens silently through `/api/auth/refresh` when the access token expires.

### 4.2 Sign-Up / Sign-In Sequence

```
User                Next.js (API Route)          Prisma/DB              Email Provider
 │                        │                          │                        │
 │  POST /api/auth/sign-up│                          │                        │
 ├───────────────────────►│                          │                        │
 │                        │  hash password (argon2)  │                        │
 │                        │  create User (unverified)│                        │
 │                        ├─────────────────────────►│                        │
 │                        │                          │                        │
 │                        │  send verification email │                        │
 │                        ├──────────────────────────┼───────────────────────►│
 │  200 OK (check email)  │                          │                        │
 │◄───────────────────────┤                          │                        │
 │                        │                          │                        │
 │  GET /verify-email?tkn │                          │                        │
 ├───────────────────────►│  mark User.verified=true │                        │
 │                        ├─────────────────────────►│                        │
 │                        │                          │                        │
 │  POST /api/auth/sign-in│                          │                        │
 ├───────────────────────►│  verify password         │                        │
 │                        │  issue access+refresh JWT│                        │
 │                        │  set httpOnly cookies     │                        │
 │  302 → /dashboard      │                          │                        │
 │◄───────────────────────┤                          │                        │
```

### 4.3 Role-Based Access Control
- `middleware.ts` intercepts all requests to `(dashboard)` routes and `/api/**` (excluding `/api/auth/*`), verifies the access token, and attaches `{ userId, role }` to the request context.
- Route handlers additionally enforce role checks via a `requireRole(["ADMIN"])` guard — defense in depth (middleware + handler-level).
- Employees attempting Admin-only routes receive `403 Forbidden`; UI never renders Admin nav items for Employee role.

---

## 5. Onboarding User Flow

```
[Admin] Invite Employee (email + role + job details)
        │
        ▼
System generates signed onboarding token (expires 72h) → emails invite link
        │
        ▼
[New Hire] Clicks link → /onboarding?token=...
        │
        ▼
Step 1: Set Password + Confirm Email  ──► verified
        │
        ▼
Step 2: Personal Details (name, phone, address, DOB)
        │
        ▼
Step 3: Job Details (pre-filled by Admin, employee confirms/edits allowed fields)
        │
        ▼
Step 4: Profile Picture Upload (Cloudinary signed upload)
        │
        ▼
Step 5: Document Upload (ID proof, signed offer letter) (Cloudinary)
        │
        ▼
Step 6: Review & Submit ──► User.status: INVITED → ACTIVE
        │
        ▼
Redirect → Employee Dashboard (with first-time welcome tour, Framer Motion)
```

Each step persists progress (`OnboardingProgress` table keyed by `userId` + `step`) so a user can close the tab and resume later without data loss.

---

## 6. Data Model (Prisma Schema — Conceptual)

```prisma
enum Role {
  ADMIN
  EMPLOYEE
}

enum UserStatus {
  INVITED
  ACTIVE
  SUSPENDED
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  HALF_DAY
  LEAVE
}

enum LeaveType {
  PAID
  SICK
  UNPAID
}

enum LeaveStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  id            String       @id @default(cuid())
  employeeId    String       @unique
  email         String       @unique
  passwordHash  String
  role          Role         @default(EMPLOYEE)
  status        UserStatus   @default(INVITED)
  emailVerified Boolean      @default(false)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  profile       Profile?
  attendance    Attendance[]
  leaveRequests LeaveRequest[]
  payroll       Payroll?
  refreshTokens RefreshToken[]
  documents     Document[]
  notifications Notification[]
  auditLogs     AuditLog[]     @relation("ActorLogs")
}

model Profile {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  fullName     String
  phone        String?
  address      String?
  department   String?
  designation  String?
  dateOfJoining DateTime?
  profileImageUrl String?   // Cloudinary URL
  updatedAt    DateTime @updatedAt
}

model Attendance {
  id          String            @id @default(cuid())
  userId      String
  user        User              @relation(fields: [userId], references: [id])
  date        DateTime          @db.Date
  checkIn     DateTime?
  checkOut    DateTime?
  status      AttendanceStatus
  createdAt   DateTime          @default(now())

  @@unique([userId, date])
}

model LeaveRequest {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  type        LeaveType
  startDate   DateTime     @db.Date
  endDate     DateTime     @db.Date
  remarks     String?
  aiSummary   String?      // Gemini-generated summary for Admin
  status      LeaveStatus  @default(PENDING)
  reviewedBy  String?
  reviewComment String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Payroll {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])
  baseSalary   Decimal
  allowances   Decimal  @default(0)
  deductions   Decimal  @default(0)
  currency     String   @default("INR")
  effectiveFrom DateTime
  updatedAt    DateTime @updatedAt
}

model PayrollHistory {
  id         String   @id @default(cuid())
  payrollId  String
  snapshot   Json      // full payroll state at time of change
  changedBy  String
  changedAt  DateTime @default(now())
}

model Document {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // ID_PROOF, OFFER_LETTER, etc.
  url       String   // Cloudinary URL
  uploadedAt DateTime @default(now())
}

model RefreshToken {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  tokenHash String
  expiresAt DateTime
  revoked   Boolean  @default(false)
  createdAt DateTime @default(now())
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model AuditLog {
  id         String   @id @default(cuid())
  actorId    String
  actor      User     @relation("ActorLogs", fields: [actorId], references: [id])
  action     String   // e.g. "LEAVE_APPROVED", "SALARY_UPDATED"
  entityType String
  entityId   String
  before     Json?
  after      Json?
  createdAt  DateTime @default(now())
}
```

---

## 7. API Design Principles
- All routes under `/app/api/**` are Next.js Route Handlers returning typed JSON.
- Input validation via **Zod** schemas shared between client forms and server handlers.
- Every mutating route writes an `AuditLog` entry for admin-visible actions (approvals, salary edits).
- Consistent error envelope: `{ error: { code, message } }` with correct HTTP status codes.
- Pagination via cursor-based queries (`?cursor=&limit=`) for employee lists and attendance history.

---

## 8. Third-Party Integrations

### 8.1 Cloudinary (Storage)
- Client requests a signed upload URL from `/api/uploads/cloudinary-sign`.
- Direct-to-Cloudinary upload from the browser (no file passes through the Next.js server, minimizing serverless payload limits).
- Cloudinary URL + public ID saved to `Profile.profileImageUrl` or `Document.url`.

### 8.2 Gemini API (AI Layer)
- Server-only calls via `lib/gemini.ts` — API key never exposed to client.
- **Chatbot** (`/api/ai/chat`): scoped context (leave policy docs, employee's own leave balance) passed as system context; no access to other employees' data.
- **Leave summarization** (`/api/ai/summarize-leave`): triggered on leave submission; stores result in `LeaveRequest.aiSummary`.
- **Attendance insights** (`/api/ai/attendance-insights`): batch job (Vercel Cron) analyzes weekly attendance and posts plain-language flags to Admin notifications.
- All AI features are **additive** — if Gemini API fails/times out, core CRUD workflows continue unaffected (graceful fallback, e.g., raw remarks shown instead of AI summary).

### 8.3 Email Provider
- Transactional emails (verification, invite, leave-status change) sent via provider API (e.g., Resend) from server-side route handlers.

---

## 9. Deployment Architecture (Vercel)

- **Single Vercel Project** connected to the monorepo's GitHub repository.
- **Preview Deployments** on every PR; **Production Deployment** on merge to `main`.
- **Environment Variables** (via Vercel dashboard, per environment):
  - `DATABASE_URL`, `DIRECT_URL` (Prisma + pooling)
  - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `GEMINI_API_KEY`
  - `EMAIL_API_KEY`, `EMAIL_FROM`
- **Database:** managed Postgres (Neon or Supabase recommended for Vercel — serverless-friendly connection pooling via Prisma Accelerate or PgBouncer).
- **Cron Jobs:** Vercel Cron for scheduled tasks (attendance insight generation, leave-balance resets).
- **Edge Middleware:** JWT verification runs at the Edge for low-latency route protection.

---

## 10. Security Considerations
- Passwords hashed with argon2/bcrypt; never logged.
- JWT secrets rotated periodically; refresh tokens revocable via DB flag (logout-all-devices support).
- CSRF protection via SameSite cookies + custom header check on state-changing requests.
- Rate limiting on `/api/auth/*` routes to prevent brute force (e.g., Vercel Edge Config or Upstash Redis).
- Zod validation on every input boundary; Prisma parameterization prevents SQL injection.
- Role checks enforced at both middleware and handler level (defense in depth).
- Signed, expiring Cloudinary upload URLs — no open write access to storage.
- Gemini API calls never include unrelated employees' PII in prompts (scoped context per request).

---

## 11. Scalability Considerations
- Stateless serverless functions scale horizontally by default on Vercel.
- Prisma + connection pooling (Accelerate/PgBouncer) avoids exhausting Postgres connections under serverless concurrency.
- Cloudinary offloads all media bandwidth from the app server.
- Read-heavy dashboard queries can be cached (Next.js `fetch` caching / React Server Component caching) with revalidation tags invalidated on writes.
- Designed to later support multi-tenancy by adding an `organizationId` foreign key across core tables (not implemented in v1, but schema is extension-friendly).
