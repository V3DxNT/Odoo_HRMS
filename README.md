# ⚡ Dayflow — Modern Human Resource Management System (HRMS)

> **Tagline:** *Every workday, perfectly aligned.*  
> Dayflow is a lightweight, lightning-fast, and beautifully crafted web-based Human Resource Management System (HRMS). Built as a modern alternative to bloated legacy enterprise software, Dayflow simplifies onboarding, attendance tracking, leave management, payroll transparency, and approval workflows for high-growth teams.

---

## 📌 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏛️ Architecture & Project Structure](#️-architecture--project-structure)
- [👥 Roles & Demo Credentials](#-roles--demo-credentials)
- [🚀 Quick Start & Installation](#-quick-start--installation)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [📡 API & Route Reference](#-api--route-reference)
- [💾 Database & Schema](#-database--schema)
- [🤖 AI Copilot Integration](#-ai-copilot-integration)
- [📜 Available Scripts](#-available-scripts)

---

## ✨ Key Features

### 🏢 1. HR & Admin Portal (`/hr`)
- **Executive KPI Dashboard:** Real-time metrics for total headcount, daily attendance rate, pending leave requests, and monthly payroll budget.
- **Leave Approval Workflow:** Review incoming leave requests with AI-summarized justification, approve in one click, or reject with a mandatory feedback reason that automatically notifies the employee.
- **Employee Directory:** Searchable and filterable employee roster by department, designation, and employment status.
- **Payroll & Salary Management:** Manage salary structures (Base, Allowances, Deductions, Net Pay) with an in-place salary editing modal.
- **Live Attendance Ledger:** Real-time log of check-in/out timestamps and work hours across all departments.
- **Analytics & Department Visualizations:** Visual breakdown of workforce distribution with interactive charts.

### 👤 2. Employee Portal (`/employee`)
- **1-Click Attendance Station:** Live check-in and check-out with an active session timer and real-time status badges (`Present`, `Half-day`, `Absent`).
- **Leave & Time-Off Management:** Real-time balance trackers (Paid, Sick, Unpaid), interactive multi-day leave application modal, and instant status tracking with HR review remarks.
- **Salary & Payslip Vault:** Transparent breakdown of earnings and deductions with **1-click client-side PDF Payslip generation & download** (`jsPDF`).
- **In-App Notification Center:** Instant notifications for leave request approvals/rejections with rejection explanations and company announcements.

### 🪪 3. Employee Profile Management (`/profile`)
- Comprehensive digital employee dossier: Job title, Department, Employee ID, Date of Joining, Emergency Contacts.
- Self-service editing for contact number and residential address.
- Document repository for identity proofs, tax declarations, and contracts.

### 🚀 4. Guided Onboarding Pipeline (`/onboarding`)
- 6-step interactive wizard for new hires:
  1. **Account Security:** Set credentials & password.
  2. **Personal Information:** Contact details, date of birth, and emergency contacts.
  3. **Job Verification:** Confirm designation, department, and joining date.
  4. **Profile Picture:** Upload user avatar.
  5. **Document Verification:** Upload government ID, offer letter, and tax forms.
  6. **Review & Activation:** Instant transition from `INVITED` to `ACTIVE` status.

### 🤖 5. Gemini AI HR Copilot
- Intelligent HR assistant drawer powered by Google Gemini (`gemini-1.5-flash`).
- Instant answers to company policy questions (leave policy, working hours, payslip dates, document deadlines).
- Built-in graceful offline fallback engine when API keys are not configured.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) | App Router, Server Components & Route Handlers |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strict mode type-safety across the stack |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first, responsive design system |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI transitions, modals, and toasts |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean and modern icon suite |
| **PDF Engine** | [jsPDF](https://github.com/parallax/jsPDF) | High-resolution salary payslip generation |
| **AI Integration** | [Google Generative AI](https://ai.google.dev/) | Gemini API for HR Assistant and leave summarization |
| **Auth & Security** | JWT + Cookies + `bcryptjs` | Role-Based Access Control (`HR` / `EMPLOYEE`) |
| **Database** | PostgreSQL / Supabase / Prisma | In-memory mock DB fallback + PostgreSQL schema |

---

## 🏛️ Architecture & Project Structure

```
Odoo_HRMS/
├── public/                     # Static assets & SVG icons
├── scripts/
│   └── schema.sql              # PostgreSQL & Supabase database schema
├── src/
│   ├── app/
│   │   ├── (auth)/             # Authentication views
│   │   ├── api/                # Next.js Serverless API Route Handlers
│   │   │   ├── ai/             # Gemini AI chat & leave summarizer endpoints
│   │   │   ├── attendance/     # Check-in, check-out, and ledger endpoints
│   │   │   ├── auth/           # Sign-in, sign-out, demo-login, session endpoints
│   │   │   ├── employees/      # Employee directory and profile endpoints
│   │   │   ├── leave/          # Leave request, approval, and balance endpoints
│   │   │   ├── notifications/  # Notification read/fetch endpoints
│   │   │   └── payroll/        # Salary structure & payslip endpoints
│   │   ├── auth/               # Sign-in page with quick demo login
│   │   ├── employee/           # Employee self-service dashboard
│   │   ├── hr/                 # HR & Admin operations dashboard
│   │   ├── onboarding/         # 6-step new employee onboarding wizard
│   │   ├── profile/            # Profile view and personal details editor
│   │   ├── globals.css         # Global styles & custom scrollbars
│   │   ├── layout.tsx          # Root layout with font configuration
│   │   └── page.tsx            # High-conversion landing & showcase page
│   ├── components/
│   │   └── ui/                 # Reusable UI component library
│   │       ├── Badge.tsx           # Status indicators (Present, Pending, etc.)
│   │       ├── EditSalaryModal.tsx # HR salary adjustment modal
│   │       ├── Header.tsx          # Navigation header with notifications
│   │       ├── HRAssistantDrawer.tsx# AI Copilot slide-over drawer
│   │       ├── LeaveApplyModal.tsx # Multi-day leave application modal
│   │       ├── RoleSwitcher.tsx    # Instant demo role switching
│   │       ├── Sidebar.tsx         # Responsive collapsible sidebar
│   │       └── StatCard.tsx        # KPI summary cards
│   ├── lib/
│   │   ├── auth/               # JWT token utilities, cookie helpers, RBAC
│   │   ├── db.ts               # In-memory reactive database store
│   │   ├── gemini.ts           # Google Gemini AI assistant & policy engine
│   │   ├── mockDb.ts           # Demo database helpers
│   │   ├── seed-data.ts        # Pre-populated realistic demo records
│   │   ├── types.ts            # TypeScript interface definitions
│   │   └── utils.ts            # Classnames & formatting helpers
│   └── middleware.ts           # Route protection & session validation
├── .env.example                # Template for environment variables
├── package.json                # Project dependencies and scripts
├── tailwind.config.ts          # Tailwind styling tokens & theme extensions
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 👥 Roles & Demo Credentials

Dayflow includes pre-configured demo accounts for immediate testing. Use the **Quick Demo Login** buttons on `/auth` or login with the credentials below:

| Role | Name | Email | Employee ID | Department |
|---|---|---|---|---|
| **HR / Admin** | Priya Sharma | `priya@dayflow.hr` | `EMP-1001` | Human Resources |
| **Employee** | Arjun Mehta | `arjun@dayflow.hr` | `EMP-1002` | Engineering |
| **Employee** | Sarah Jenkins | `sarah@dayflow.hr` | `EMP-1003` | Product Design |
| **New Hire** | Alex Rivera | `alex@dayflow.hr` | `EMP-1004` | Growth Marketing |

> 💡 *Default password for demo accounts in local development:* `Demo@1234`

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/Odoo_HRMS.git
cd Odoo_HRMS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(On Windows PowerShell: `Copy-Item .env.example .env.local`)*

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view Dayflow!

---

## ⚙️ Environment Configuration

Fill in your variables inside `.env.local`:

```env
# ── Supabase / PostgreSQL (Optional for Production DB) ────────
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# ── Supabase Public Keys ──────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# ── JWT Auth Secrets ──────────────────────────────────────────
JWT_ACCESS_SECRET="generate-a-secure-random-32-byte-secret"
JWT_REFRESH_SECRET="generate-another-secure-random-32-byte-secret"

# ── Google Gemini AI ──────────────────────────────────────────
# Get your free key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIzaSy..."

# ── Cloudinary (Optional - For file uploads) ───────────────────
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

> **Note:** If `GEMINI_API_KEY` or `DATABASE_URL` is omitted, Dayflow seamlessly falls back to the embedded in-memory reactive database and built-in HR policy knowledge engine, allowing full local functionality without external services.

---

## 📡 API & Route Reference

### 🔐 Authentication & Session
- `POST /api/auth/sign-in` — Authenticate user and issue secure JWT cookies.
- `POST /api/auth/demo-login` — Quick one-click authentication for demo accounts.
- `POST /api/auth/sign-out` — Clear session cookies and revoke tokens.
- `GET /api/auth/me` — Retrieve the current authenticated user profile.

### ⏱️ Attendance
- `GET /api/attendance` — Fetch attendance records (supports filtering by user/date).
- `POST /api/attendance/check-in` — Register daily check-in timestamp.
- `POST /api/attendance/check-out` — Register check-out and compute total hours worked.

### 🏖️ Leave Management
- `GET /api/leave` — Retrieve leave requests and balances.
- `POST /api/leave` — Submit a new leave request (triggers AI summary).
- `POST /api/leave/[id]/approve` — Approve or reject a leave request with mandatory review comments.

### 💰 Payroll & Directory
- `GET /api/employees` — List all registered employees with profile details.
- `GET /api/payroll/[employeeId]` — Fetch salary breakdown for an employee.
- `PATCH /api/payroll/[employeeId]` — Update employee salary components.

### 🤖 AI Copilot
- `POST /api/ai/chat` — HR policy Q&A assistant powered by Gemini.
- `POST /api/ai/summarize-leave` — Condense employee leave remarks for fast HR review.

---

## 💾 Database & Schema

Dayflow is designed to run with PostgreSQL / Supabase. The complete relational schema is provided in [`scripts/schema.sql`](file:///scripts/schema.sql):

- `users` — Authentication credentials, role (`HR` / `EMPLOYEE`), and account status.
- `profiles` — Personal info, contact details, department, designation, and avatar.
- `attendance` — Daily check-in/out logs, status (`PRESENT`, `ABSENT`, `HALF_DAY`), and hours.
- `leave_requests` — Leave applications, dates, type (`PAID`, `SICK`, `UNPAID`), status, and HR comments.
- `payroll` — Base pay, allowances, deductions, net salary, and currency.
- `documents` — Metadata and URLs for uploaded identification and tax records.
- `notifications` — In-app alerts for status updates, payroll notices, and approvals.
- `audit_logs` — Immutable audit trail of administrative modifications.

---

## 🤖 AI Copilot Integration

Dayflow includes an intelligent HR Assistant drawer on both Employee and HR dashboards:
- **Policy Answers:** Ask questions regarding paid time off limits, sick leave certification rules, work hour grace periods, and salary disbursement schedules.
- **Smart Leave Summaries:** Automatically generates succinct bullet summaries of lengthy employee leave explanations for rapid manager approval.
- **Graceful Fallback:** If the Gemini API is unreachable, Dayflow uses a rule-based expert system to provide instant answers without interruption.

---

## 📜 Available Scripts

In the project root, you can run:

```bash
# Start Next.js development server on localhost:3000
npm run dev

# Create optimized production build
npm run build

# Start production server
npm run start

# Run ESLint validation
npm run lint
```

---

## 📄 License
This project is developed for modern HR automation. Distributed under the MIT License.
