# Dayflow — Functionality & API Reference (functions.md)

**Version:** 1.0
**Derived from:** original Dayflow HRMS requirements PDF, PRD.md, architecture.md
**Purpose:** Single reference mapping every functional requirement to its user-facing behavior and the exact API call(s) that implement it.

**Conventions used below:**
- `🔒 Auth` = requires valid JWT session (any role)
- `🛡 Admin` = requires `role: ADMIN`
- `👤 Employee` = requires `role: EMPLOYEE` (or self-scoped for either role)
- `🌐 Public` = no auth required
- All request/response bodies are illustrative shapes, not exhaustive schemas (see architecture.md §6 for the full Prisma schema).

---

## 1. Authentication & Authorization
*(PDF §3.1 — Sign Up / Sign In)*

| Functionality | Requirement | API Call |
|---|---|---|
| Register account | FR-1.1 — Register via Employee ID, Email, Password, Role (or via Admin invite, see §2) | 🌐 `POST /api/auth/sign-up`<br>Body: `{ employeeId, email, password, role }`<br>Resp: `201 { userId, status: "INVITED" }` |
| Password rules | FR-1.2 — Min 8 chars, upper/lower/number/special, hashed (argon2/bcrypt) before storage | Enforced server-side in `POST /api/auth/sign-up` via Zod schema before hashing; no separate endpoint |
| Email verification | FR-1.3 — Required before first login; sent immediately on sign-up | 🌐 `GET /api/auth/verify-email?token=...`<br>Resp: `200 { verified: true }` → redirects to `/sign-in` |
| Resend verification | FR-1.8 — Rate-limited resend (1/60s, 5/day) with inline UX and countdown | 🔒 `POST /api/auth/resend-verification`<br>Body: `{ email }`<br>Resp: `200 { sent: true, cooldownSeconds: 60 }` or `429 { error: "rate_limited" }` |
| Sign in | FR-1.4 — Issues access + refresh JWT in httpOnly cookies | 🌐 `POST /api/auth/sign-in`<br>Body: `{ email, password }`<br>Resp: `200 { userId, role }` + `Set-Cookie: dayflow_access, dayflow_refresh` |
| Error handling | FR-1.5 — Non-revealing invalid credential errors | Same endpoint as above; always returns `401 { error: "invalid_credentials" }` for both wrong password and unknown email |
| Post-login redirect | FR-1.6 — Redirect to role-based dashboard | Client-side redirect using `role` in sign-in response: `ADMIN → /admin`, `EMPLOYEE → /employee` |
| Session refresh | FR-1.7 — Silent refresh-token rotation | 🔒 `POST /api/auth/refresh`<br>Reads `dayflow_refresh` cookie, issues new access token + rotated refresh token |
| Sign out | — | 🔒 `POST /api/auth/sign-out`<br>Revokes current `RefreshToken` row, clears cookies |
| Forgot password | FR-1.9 — Time-boxed reset link, no account enumeration, revokes other sessions on success | 🌐 `POST /api/auth/forgot-password`<br>Body: `{ email }` → always `200 { sent: true }`<br>🌐 `POST /api/auth/reset-password`<br>Body: `{ token, newPassword }` → `200 { reset: true }`, revokes all `RefreshToken` rows for user, triggers confirmation email |
| Security event logging | FR-1.10 — Log verification/reset/password-changed events | Internal — written to `EmailLog`/`AuditLog` inside the handlers above, no dedicated client-facing endpoint |

---

## 2. Onboarding Flow
*(PDF Scope — "Secure authentication" + derived onboarding requirement)*

| Functionality | Requirement | API Call |
|---|---|---|
| Invite employee | FR-2.1, FR-2.6 — Admin invites via email; signed link, 72h expiry, includes inviter/company/role/expiry | 🛡 `POST /api/onboarding/invite`<br>Body: `{ email, employeeId, role, department, designation }`<br>Resp: `201 { onboardingToken, expiresAt }`; triggers invite email |
| Verify + set password | FR-2.2 — Combined verification + password creation as onboarding step 1 | 🌐 `POST /api/onboarding/verify`<br>Body: `{ token, password }`<br>Resp: `200 { userId, nextStep: "personal-details" }` |
| Resume onboarding | FR-2.4 — Step-by-step save, resumable via same link | 🔒 `GET /api/onboarding/progress?token=...`<br>Resp: `200 { currentStep, savedData }`<br>🔒 `PATCH /api/onboarding/progress`<br>Body: `{ step, data }` → saved to `OnboardingProgress` |
| Submit personal/job details | FR-2.3 | 🔒 `PATCH /api/onboarding/progress` (step: `personal-details` / `job-details`) |
| Upload profile picture | FR-2.3 | 🔒 `POST /api/uploads/cloudinary-sign` (get signed URL) → client uploads directly to Cloudinary → 🔒 `PATCH /api/onboarding/progress` (step: `profile-picture`, data: `{ profileImageUrl }`) |
| Upload documents | FR-2.3 | Same signed-upload pattern as above, step: `documents`, may call multiple times for multiple files |
| Complete onboarding | FR-2.5, FR-2.9 — Status flips INVITED→ACTIVE; welcome + Admin confirmation emails | 🔒 `POST /api/onboarding/complete`<br>Body: `{ token }`<br>Resp: `200 { status: "ACTIVE" }`; triggers welcome email (employee) + confirmation email (inviting Admin) |
| Expired invite handling | FR-2.7 — Clear expired state + "Request new invite" | 🌐 `GET /api/onboarding/status?token=...` → `200 { valid: false, reason: "expired" }`<br>🌐 `POST /api/onboarding/request-new-invite`<br>Body: `{ token }` → notifies Admin in-app + email |
| Resend invite | FR-2.8 — Admin resends, invalidates old token | 🛡 `POST /api/onboarding/[userId]/resend-invite`<br>Resp: `200 { onboardingToken, expiresAt }`; old token invalidated |
| Resend verification (in onboarding) | FR-2.10 — Same cooldown pattern as FR-1.8 | 🌐 `POST /api/onboarding/resend-code`<br>Body: `{ token }` → `200 { sent: true, cooldownSeconds: 60 }` |

---

## 3. Dashboard
*(PDF §3.2 — Employee & Admin/HR Dashboard)*

| Functionality | Requirement | API Call |
|---|---|---|
| Employee dashboard data | FR-3.1 — Quick-access cards + recent activity | 👤 `GET /api/employee/dashboard`<br>Resp: `{ checkInStatus, leaveBalances, recentActivity[] }` |
| Admin dashboard data | FR-3.2 — Employee list, attendance overview, pending approvals, employee switcher | 🛡 `GET /api/admin/dashboard`<br>Resp: `{ headcount, attendanceRateToday, pendingApprovals, payrollOutflow }` |
| Recent activity feed | FR-3.1 | 🔒 `GET /api/notifications?limit=10` (also powers in-app notification center, §7) |

---

## 4. Employee Profile Management
*(PDF §3.3)*

| Functionality | Requirement | API Call |
|---|---|---|
| View own profile | FR-4.1 | 👤 `GET /api/employees/me`<br>Resp: full `Profile` + `Payroll` (read-only) + `Document[]` |
| Edit own profile (limited fields) | FR-4.2 — Employee can edit phone/address/profile picture | 👤 `PATCH /api/employees/me`<br>Body: `{ phone?, address?, profileImageUrl? }` |
| View any employee | FR-4.1 (Admin scope) | 🛡 `GET /api/employees/[id]` |
| Edit any employee (full) | FR-4.3 — Admin edits all fields, reassigns role/department | 🛡 `PATCH /api/employees/[id]`<br>Body: full `Profile` fields + `role`, `department` |
| List/search employees | Admin directory (design.md §6.2) | 🛡 `GET /api/employees?search=&department=&cursor=&limit=` |

---

## 5. Attendance Management
*(PDF §3.4)*

| Functionality | Requirement | API Call |
|---|---|---|
| Check in | FR-5.1 | 👤 `POST /api/attendance/check-in`<br>Resp: `201 { attendanceId, checkIn }`; upserts on `[userId, date]` |
| Check out | FR-5.1 | 👤 `POST /api/attendance/check-out`<br>Resp: `200 { checkOut, computedStatus }` |
| Daily/weekly view (own) | FR-5.2, FR-5.3 | 👤 `GET /api/attendance/me?range=weekly&from=&to=` |
| All-employee attendance (Admin) | FR-5.3 — Filterable by department/date range | 🛡 `GET /api/attendance?department=&from=&to=&cursor=` |
| Attendance anomaly flags | FR-5.4 — AI-assisted, surfaced to Admin | 🛡 `GET /api/ai/attendance-insights` (reads pre-computed batch results, see §9); underlying batch job: internal Vercel Cron → `POST /api/ai/attendance-insights` (system-triggered, not user-facing) |

---

## 6. Leave & Time-Off Management
*(PDF §3.5)*

| Functionality | Requirement | API Call |
|---|---|---|
| Apply for leave | FR-6.1, FR-6.2 — Type, date range, remarks; balance shown before submit | 👤 `GET /api/leave/balance` (pre-submit check)<br>👤 `POST /api/leave`<br>Body: `{ type, startDate, endDate, remarks }` → `201 { leaveId, status: "PENDING" }`; triggers AI summary (§9) + Admin notification email |
| View own leave requests | FR-6.3 | 👤 `GET /api/leave/me` |
| View all leave requests (Admin) | FR-6.3 | 🛡 `GET /api/leave?status=PENDING&cursor=` |
| Approve/reject leave | FR-6.3 — With comments | 🛡 `POST /api/leave/[id]/approve`<br>Body: `{ decision: "APPROVED" \| "REJECTED", comment? }`; writes `AuditLog`, triggers employee notification email |
| AI leave summary | FR-6.4 | Internal — invoked from within `POST /api/leave` handler; see §9 for the underlying `POST /api/ai/summarize-leave` |
| Status-change notification | FR-6.5 | Internal — triggered inside `POST /api/leave/[id]/approve`, no separate client call |

---

## 7. Payroll / Salary Management
*(PDF §3.6)*

| Functionality | Requirement | API Call |
|---|---|---|
| View own payroll (read-only) | FR-7.1 | 👤 `GET /api/payroll/me` |
| Download payslip PDF | FR-7.1 | 👤 `GET /api/payroll/me/payslip?month=&year=` → returns generated PDF (jsPDF, server or client-generated) |
| View any employee's payroll (Admin) | FR-7.2 | 🛡 `GET /api/payroll/[employeeId]` |
| Update salary structure | FR-7.2, FR-7.3 — Versioned/audit-logged | 🛡 `PATCH /api/payroll/[employeeId]`<br>Body: `{ baseSalary, allowances, deductions, effectiveFrom }` → writes `PayrollHistory` snapshot + `AuditLog`; triggers employee notification email (no salary figures in email body) |
| Bulk payslip generation | FR-7.2 | 🛡 `POST /api/payroll/generate-payslips`<br>Body: `{ month, year }` → generates payslips for all active employees, triggers "payslip available" email per employee |

---

## 8. Notifications & Alerts (Email + In-App)
*(PDF §5 bullet — "Email & notification alerts"; expanded per PRD §5.8/§5.11)*

| Functionality | Requirement | API Call |
|---|---|---|
| In-app notification list | FR-8.2 | 🔒 `GET /api/notifications?read=false` |
| Mark notification read | FR-8.2 | 🔒 `PATCH /api/notifications/[id]`<br>Body: `{ read: true }` |
| Email send (internal service) | FR-8.1, FR-8.3, FR-8.4 | Internal `lib/email.ts` → `sendEmail({ to, template, data })`; not a client-facing route. Called from: sign-up, resend-verification, forgot-password, reset-password, onboarding/invite, onboarding/resend-invite, onboarding/request-new-invite, onboarding/complete, leave/create, leave/approve, payroll/update, payroll/generate-payslips, ai/attendance-insights (digest) |
| Failed-send system alert | FR-8.4 | Internal — writes to `EmailLog`/`AuditLog`; surfaced via 🛡 `GET /api/admin/system-alerts` |

**Full email trigger → endpoint map** (see PRD.md §5.8 trigger matrix for recipients/timing):

| Email | Triggered from |
|---|---|
| Verification | `POST /api/auth/sign-up`, `POST /api/auth/resend-verification` |
| Password reset link | `POST /api/auth/forgot-password` |
| Password changed | `POST /api/auth/reset-password` |
| Employee invite | `POST /api/onboarding/invite` |
| Invite resent | `POST /api/onboarding/[userId]/resend-invite` |
| Invite expired → Admin alert | `POST /api/onboarding/request-new-invite` |
| Onboarding completed (x2) | `POST /api/onboarding/complete` |
| Leave submitted | `POST /api/leave` |
| Leave status changed | `POST /api/leave/[id]/approve` |
| Payroll updated | `PATCH /api/payroll/[employeeId]` |
| Payslip available | `POST /api/payroll/generate-payslips` |
| Attendance anomaly digest | Cron → `POST /api/ai/attendance-insights` |

---

## 9. Analytics & Reports
*(PDF §5 bullet — "Analytics & reports dashboard")*

| Functionality | Requirement | API Call |
|---|---|---|
| Attendance summary report | FR-9.1 | 🛡 `GET /api/reports/attendance?department=&from=&to=&format=csv\|json` |
| Salary slip batch export | FR-9.1 | 🛡 `GET /api/reports/payroll?month=&year=&format=csv\|pdf` |
| Dashboard analytics charts | FR-9.2 — Headcount trends, attendance rate, leave utilization | 🛡 `GET /api/reports/analytics?metric=headcount\|attendance\|leave-utilization&range=` |
| CSV data exporter (Reports page) | design.md §6.2 | 🛡 `GET /api/reports/export?type=attendance\|payroll\|leave&format=csv` |

---

## 10. AI Integration (Gemini API)
*(New — HRMS enhancement beyond original PDF, defined in PRD §5.10, architecture.md §8.2)*

| Functionality | Requirement | API Call |
|---|---|---|
| HR assistant chatbot | FR-10.1 — Scoped to requesting user's own data + static policy text | 🔒 `POST /api/ai/chat`<br>Body: `{ message, conversationId? }`<br>Resp: `200 { reply }`; server builds context from caller's `LeaveRequest`/`Attendance` only |
| Leave remark summarization | FR-10.2 | Internal `POST /api/ai/summarize-leave` (called from `POST /api/leave`); Body: `{ remarks }` → `{ summary }`, stored in `LeaveRequest.aiSummary` |
| Attendance anomaly insights | FR-10.3 | System-triggered `POST /api/ai/attendance-insights` (Vercel Cron, weekly); results read via 🛡 `GET /api/ai/attendance-insights` |
| Resume/document parsing (future) | FR-10.4 — Not in v1 | Planned: `POST /api/ai/parse-document` (onboarding document upload → pre-fill profile fields) |

**AI fallback behavior (applies to all AI endpoints):** every call wraps Gemini in a try/catch with a timeout; on failure, the calling flow degrades gracefully (raw remarks instead of summary, chatbot shows "couldn't reach AI assistant", anomaly digest simply skips that cycle) — no core workflow blocks on AI availability, per architecture.md §8.2.

---

## 11. File Storage (Cloudinary)
*(Supports PDF §3.3 "Profile picture" and §5 "Documents")*

| Functionality | Requirement | API Call |
|---|---|---|
| Get signed upload URL | Supports FR-2.3, FR-4.2 | 🔒 `POST /api/uploads/cloudinary-sign`<br>Body: `{ folder: "profile-pictures" \| "documents" }`<br>Resp: `{ signature, timestamp, apiKey, cloudName }`; client uploads directly to Cloudinary, server never handles the file bytes |
| Attach uploaded document to profile | FR-4.1 | 👤 `POST /api/documents`<br>Body: `{ type, url }` (Cloudinary URL from the direct upload) → creates `Document` row |

---

## 12. Cross-Cutting: Middleware & Audit
*(Not user-facing functionality, but required by every module above)*

| Functionality | Requirement | Mechanism |
|---|---|---|
| Route protection | architecture.md §4.3 | `middleware.ts` verifies JWT on every `(dashboard)` and `/api/**` route (except `/api/auth/*`, `/api/onboarding/*` pre-auth steps) |
| Role enforcement | architecture.md §4.3 | Handler-level `requireRole(["ADMIN"])` guard in addition to middleware, on every 🛡 route above |
| Audit logging | FR-7.3, FR-6.3 (approvals), FR-1.10 | Every mutating 🛡 route (payroll update, leave approve) writes an `AuditLog` row; readable via 🛡 `GET /api/admin/audit-log?entityType=&from=&to=` |

---

## Summary: Endpoint Count by Module

| Module | Endpoints |
|---|---|
| Auth | 9 |
| Onboarding | 9 |
| Dashboard | 3 |
| Profile | 4 |
| Attendance | 5 |
| Leave | 5 |
| Payroll | 5 |
| Notifications/Email | 4 (+ 12 internal triggers) |
| Analytics/Reports | 4 |
| AI (Gemini) | 4 |
| File Storage | 2 |
| Audit | 1 |
| **Total** | **~55 endpoints** |