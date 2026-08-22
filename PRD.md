# Dayflow — Product Requirements Document (PRD)

**Tagline:** Every workday, perfectly aligned.
**Version:** 1.0
**Status:** Draft for Development
**Owner:** Product Team

---

## 1. Overview

### 1.1 Purpose
Dayflow is a modern, web-based Human Resource Management System (HRMS) built to digitize and streamline core HR operations — onboarding, attendance, leave management, payroll visibility, and approval workflows — for small-to-mid-sized organizations. Dayflow is designed as a lightweight, fast, and beautifully simple alternative to bloated enterprise HR suites.

### 1.2 Vision
HR software today is either too heavy (Workday), too generic-looking (BambooHR), or too fragmented (spreadsheets + email + Slack). Dayflow's vision is to be the **single, calm, well-designed home page of a company's workday** — where an employee logs in once and every routine HR task (checking in, applying for leave, viewing a payslip) takes seconds, not minutes.

### 1.3 Problem Statement
- HR teams at small and mid-sized companies rely on disconnected tools (Excel sheets, email threads, WhatsApp) for attendance and leave tracking, causing data loss and approval delays.
- Existing enterprise HRMS platforms (Workday, SAP SuccessFactors) are expensive, over-engineered, and require weeks of onboarding/training.
- Mid-market tools (BambooHR, Zoho People) are functional but dated in UX, slow, and charge per-employee pricing that scales poorly.
- None of the mainstream tools use AI meaningfully — they are static forms and tables, not assistants.

### 1.4 Solution
Dayflow provides the essential HR workflows (auth, onboarding, attendance, leave, payroll visibility, approvals) in a single Next.js monorepo application with:
- A fast, minimal, animated interface (Framer Motion) that feels like a modern SaaS product, not legacy enterprise software.
- AI-assisted HR operations via the Gemini API (e.g., leave-request summarization, HR chatbot assistance, smart onboarding document review).
- A single deployable unit (frontend + backend + DB layer) shippable to Vercel with zero DevOps overhead — ideal for startups and SMBs who don't have an infra team.

---

## 2. Goals & Objectives

| Goal | Description |
|---|---|
| G1 — Simplicity | Every core HR task completable in ≤3 clicks from the dashboard. |
| G2 — Speed to deploy | A company should be able to sign up, onboard employees, and go live in under a day. |
| G3 — Trustworthy approvals | Every leave/attendance approval action is logged, auditable, and reflected in real time. |
| G4 — AI-augmented HR | Reduce manual HR admin overhead using Gemini-powered assistance (summaries, anomaly flags, smart replies). |
| G5 — Affordability | Single self-hostable / Vercel-deployable stack — no per-seat enterprise licensing complexity. |

### 2.1 Success Metrics (KPIs)
- **Activation:** % of invited employees who complete onboarding within 48 hours (target ≥ 90%).
- **Engagement:** Average check-in completion rate per working day (target ≥ 95%).
- **Efficiency:** Median time from leave request submission to HR decision (target < 24 hours).
- **Adoption:** % reduction in HR-related emails/Slack messages after 30 days of use (target ≥ 60%, self-reported).
- **Reliability:** 99.5% uptime on Vercel; API p95 latency < 400ms.

---

## 3. Target Users & Personas

### 3.1 Persona A — "Priya, the HR Officer / Admin"
- Manages 20–300 employees across departments.
- Needs a single dashboard to view attendance, approve leave, and manage payroll structures without spreadsheets.
- Values audit trails and the ability to quickly search/filter employees.

### 3.2 Persona B — "Arjun, the Employee"
- Wants to check in/out, apply for leave, and view his payslip without calling HR.
- Uses the product on both desktop and mobile browsers.
- Cares about clarity — "Is my leave approved or not?" should be answered in one glance.

### 3.3 Persona C — "New Hire / Onboarding User"
- Just received an invite email. Needs a guided, low-friction sign-up → profile completion → document upload flow before reaching the dashboard for the first time.

---

## 4. Scope

### 4.1 In Scope (v1)
- Secure authentication: Sign Up, Sign In, Email Verification, Sign Out (JWT + httpOnly cookies).
- Role-based access control: Admin/HR Officer vs Employee.
- Guided onboarding flow for new employees (invite → account setup → profile completion → document upload → dashboard).
- Employee profile management (view/edit personal, job, salary, documents, profile picture via Cloudinary).
- Attendance tracking: daily/weekly views, check-in/check-out, status types (Present, Absent, Half-day, Leave).
- Leave & time-off management: apply, track status (Pending/Approved/Rejected), HR approval workflow with comments.
- Payroll visibility: read-only salary view for employees; full CRUD for Admin.
- Admin dashboard: employee directory, attendance records, leave approval queue, employee switcher.
- Notifications: in-app + email alerts for leave status changes, approvals, and reminders.
- Analytics & reports dashboard: salary slips, attendance summaries, exportable reports.
- AI integration (Gemini API): HR assistant chatbot for FAQs, auto-summarized leave justifications for admins, anomaly detection on attendance patterns.

### 4.2 Out of Scope (v1 — Future Enhancements)
- Multi-company / multi-tenant SaaS billing.
- Native mobile apps (iOS/Android) — mobile web only in v1.
- Payroll processing/disbursement (bank integration) — v1 is visibility only, not payment execution.
- Performance review / appraisal cycles.
- Recruitment/ATS module.
- Biometric/geofenced attendance.

---

## 5. Functional Requirements

### 5.1 Authentication & Authorization
- FR-1.1: Users register with Employee ID, Email, Password, and Role (Employee/HR), OR are invited by an Admin (preferred flow for onboarding).
- FR-1.2: Passwords must meet complexity rules (min 8 chars, upper/lower/number/special character) and are hashed (bcrypt/argon2) before storage.
- FR-1.3: Email verification required before first login (OTP or verification link).
- FR-1.4: Sign-in issues a short-lived JWT access token + long-lived refresh token stored in httpOnly, Secure, SameSite cookies.
- FR-1.5: Invalid credentials return clear, non-revealing error messages (no "email not found" vs "wrong password" leakage).
- FR-1.6: Successful login redirects to role-based dashboard (Admin vs Employee).
- FR-1.7: Session refresh handled silently via refresh-token rotation; expired sessions redirect to Sign In.

### 5.2 Onboarding Flow (New Requirement — Derived from Scope)
- FR-2.1: Admin invites a new employee via email (generates a unique onboarding link, valid for 72 hours).
- FR-2.2: Invited user sets password and verifies email.
- FR-2.3: Guided multi-step onboarding form: Personal Details → Job Details (pre-filled by Admin, employee confirms) → Profile Picture Upload → Document Upload (ID proof, contracts) → Review & Submit.
- FR-2.4: Progress is saved at each step (resumable onboarding).
- FR-2.5: On completion, employee status flips from "Invited" → "Active" and employee lands on their dashboard with a welcome tour.

### 5.3 Dashboard
- FR-3.1 (Employee): Quick-access cards — Profile, Attendance, Leave Requests, Payslips, Logout. Recent activity/alerts feed.
- FR-3.2 (Admin/HR): Employee list with search/filter, attendance overview, pending leave approvals count, quick employee switcher, analytics snapshot.

### 5.4 Employee Profile Management
- FR-4.1: Employees view personal details, job details, salary structure, documents, profile picture.
- FR-4.2: Employees can edit limited fields (address, phone, profile picture) — changes may require Admin approval for sensitive fields.
- FR-4.3: Admin can edit all employee details and reassign roles/departments.

### 5.5 Attendance Management
- FR-5.1: Employees check in/check out; system timestamps and computes daily status.
- FR-5.2: Daily and weekly calendar views with color-coded statuses (Present, Absent, Half-day, Leave).
- FR-5.3: Employees view only their own records; Admin/HR views all records, filterable by department/date range.
- FR-5.4: AI-assisted anomaly flagging (e.g., repeated late check-ins) surfaced to Admin dashboard.

### 5.6 Leave & Time-Off Management
- FR-6.1: Employees select leave type (Paid/Sick/Unpaid), date range, and remarks.
- FR-6.2: System shows remaining leave balance per type before submission.
- FR-6.3: Leave requests move through Pending → Approved/Rejected states; Admin can add comments.
- FR-6.4: Gemini API auto-generates a concise summary of the leave remark for the Admin's quick review on high-volume days.
- FR-6.5: Status changes trigger real-time in-app + email notifications to the employee.

### 5.7 Payroll / Salary Management
- FR-7.1: Employees view a read-only salary structure and downloadable payslips (PDF).
- FR-7.2: Admin can view all payroll data, update salary structures, and generate payslips in bulk.
- FR-7.3: Payroll changes are versioned/audit-logged (who changed what, when).

### 5.8 Notifications & Alerts
- FR-8.1: Email notifications (via transactional email provider) for: invite, verification, leave status change, payroll updates.
- FR-8.2: In-app notification center with read/unread state.

### 5.9 Analytics & Reports
- FR-9.1: Admin can generate/export attendance summary reports and salary slip batches (CSV/PDF).
- FR-9.2: Dashboard charts: headcount trends, attendance rate, leave utilization by department.

### 5.10 AI Integration (Gemini API)
- FR-10.1: In-app HR assistant chatbot answering employee FAQs (leave policy, holiday calendar, "how many leave days do I have left").
- FR-10.2: Smart leave-remark summarization for Admin review.
- FR-10.3: Attendance pattern anomaly insights surfaced as plain-language summaries.
- FR-10.4: (Future) Resume/document parsing during onboarding to pre-fill profile fields.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Page loads < 2s on 4G; API responses p95 < 400ms. |
| Security | JWT in httpOnly cookies, CSRF protection, RBAC on every API route, encrypted secrets, OWASP Top 10 compliance. |
| Scalability | Stateless API routes on Vercel Serverless Functions; Postgres connection pooling (e.g., PgBouncer/Prisma Accelerate) for scale. |
| Availability | 99.5% uptime target; graceful degradation if Gemini API is unavailable (core HR features must not depend on AI). |
| Accessibility | WCAG 2.1 AA compliant — keyboard navigation, screen-reader labels, sufficient color contrast. |
| Data Privacy | PII (salary, documents) encrypted at rest; role-scoped access; GDPR-style data export/delete support. |
| Browser Support | Latest 2 versions of Chrome, Safari, Firefox, Edge; responsive down to 375px width. |
| Auditability | All approval/edit actions logged with actor, timestamp, and before/after state. |

---

## 7. User Stories (Sample)

- As an **Admin**, I want to invite a new employee by email so that they can self-onboard without manual data entry.
- As an **Employee**, I want to check in with one click so that my attendance is recorded without extra steps.
- As an **Employee**, I want to see my remaining leave balance before applying so I don't over-request.
- As an **HR Officer**, I want an AI-generated summary of a bulk leave day's requests so I can approve/reject faster.
- As an **Admin**, I want to update an employee's salary structure and have it versioned so I can audit changes later.
- As an **Employee**, I want to download my payslip as a PDF so I can use it for financial documentation.

---

## 8. Competitive Analysis — Why Dayflow vs. Workday & BambooHR

| Dimension | Workday | BambooHR | **Dayflow** |
|---|---|---|---|
| Setup time | Weeks (consultant-led implementation) | Days | **Hours** — invite-based onboarding, live same day |
| UX | Dense, enterprise-grade, steep learning curve | Functional but visually dated | **Minimal, animated, modern** (Framer Motion, calm UI) |
| Pricing model | Enterprise contracts, opaque, expensive | Per-employee/month, adds up at scale | **Self-deployable** on Vercel — infra cost scales with usage, not per-seat licensing |
| AI capability | Add-on modules, enterprise-tier only | Limited/none in core plans | **Native Gemini integration** — HR chatbot, smart summaries, anomaly detection out of the box |
| Customization | Requires professional services | Config-heavy admin panels | **Code-owned monorepo** — full control, no vendor lock-in |
| Target org size | Large enterprise (1000+ employees) | Mid-market (50–1000) | **SMB/startup-first** (10–500 employees), scalable up |
| Time to first value | Slow — heavy implementation phase | Moderate | **Fast** — dashboard-ready within onboarding flow |

**Positioning statement:** *Dayflow is the HR system a 30-person startup can stand up before lunch, and a 300-person company can still trust — without paying enterprise prices or living inside a decade-old UI.*

---

## 9. Assumptions & Constraints
- Single organization/tenant per deployment in v1 (multi-tenancy deferred).
- Email delivery relies on a third-party transactional email service (e.g., Resend/SendGrid) — not specified in original PDF, to be selected in architecture phase.
- Cloudinary handles all file storage (profile pictures, documents) — no local file storage.
- Gemini API usage is supplementary; all core workflows must function if AI features are degraded/unavailable.
- Deployment target is Vercel; database is managed Postgres (e.g., Neon/Supabase/Vercel Postgres).

---

## 10. Release Roadmap

| Phase | Scope |
|---|---|
| **Phase 1 — Foundation** | Auth (JWT/cookies), RBAC, DB schema, monorepo scaffold, landing page |
| **Phase 2 — Core HR** | Onboarding flow, profile management, attendance tracking |
| **Phase 3 — Workflows** | Leave management + approval workflow, notifications |
| **Phase 4 — Payroll & Analytics** | Payroll visibility, reports dashboard, PDF payslips |
| **Phase 5 — AI Layer** | Gemini-powered chatbot, leave summarization, anomaly insights |
| **Phase 6 — Polish & Launch** | Motion/UI polish, accessibility audit, performance tuning, Vercel production deploy |

---

## 11. Future Enhancements (Post-v1)
- Multi-tenant SaaS mode with org-level billing.
- Native mobile apps.
- Payroll disbursement integration (bank APIs).
- Performance review & appraisal cycles.
- Recruitment/ATS module.
- Slack/Teams integration for approvals and notifications.
- Geofenced/biometric attendance.
