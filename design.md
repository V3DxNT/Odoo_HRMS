# Dayflow — Design Document

**Version:** 1.0
**Companion to:** PRD.md, architecture.md

---

## 1. Design Philosophy

Dayflow's design language is **formal, minimal, and calm** — the visual opposite of cluttered enterprise HR software. The guiding principle: *an HR tool should feel like a quiet, well-organized office, not a dashboard covered in widgets.*

Three principles anchor every screen:

1. **Restraint over density.** One primary action per screen. Secondary information is available, not shouted.
2. **Motion with purpose.** Framer Motion is used to guide attention (page transitions, status changes, approval feedback) — never decoration for its own sake.
3. **Trust through clarity.** Status (Pending/Approved, Present/Absent) is always communicated through both color *and* text/icon — never color alone.

This directly differentiates Dayflow from Workday's dense enterprise grids and BambooHR's dated, icon-heavy panels — Dayflow reads more like a modern fintech or productivity SaaS product (e.g., Linear, Notion) than legacy HR software.

---

## 2. Color System (Minimal Tone Palette)

A near-monochrome base with a single accent color used sparingly for primary actions and status.

| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` | `#FAFAF9` | App background (warm off-white, not stark white) |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--bg-elevated` | `#F4F4F3` | Hover states, subtle section dividers |
| `--border-subtle` | `#E7E5E4` | Card borders, dividers |
| `--text-primary` | `#1C1917` | Headings, primary text |
| `--text-secondary` | `#57534E` | Body copy, secondary labels |
| `--text-muted` | `#A8A29E` | Placeholder text, timestamps |
| `--accent` | `#2563EB` | Primary buttons, active states, links (single blue accent) |
| `--accent-hover` | `#1D4ED8` | Button hover state |
| `--success` | `#15803D` | Approved / Present |
| `--warning` | `#B45309` | Pending / Half-day |
| `--danger` | `#B91C1C` | Rejected / Absent |
| `--dark-bg` (optional dark mode) | `#0C0A09` | Dark mode background |

**Rule:** No more than one saturated accent color (`--accent`) plus three semantic status colors appear on any single screen. Everything else is neutral gray/stone tones. No gradients, no drop shadows beyond a 1–2px soft elevation.

---

## 3. Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display / Hero | Inter or Geist Sans | 600 | 48–64px |
| Page Heading (H1) | Inter / Geist Sans | 600 | 32px |
| Section Heading (H2) | Inter / Geist Sans | 600 | 22px |
| Card Title (H3) | Inter / Geist Sans | 500 | 16px |
| Body | Inter / Geist Sans | 400 | 14–15px |
| Caption / Meta | Inter / Geist Sans | 400 | 12–13px |
| Numeric/Data (payroll, attendance %) | Geist Mono / IBM Plex Mono | 500 | tabular-nums |

- Line height: 1.5 for body, 1.2 for headings.
- Letter spacing: slightly tight (-0.01em) on large headings for a refined, formal feel.
- Numeric data (salary figures, hours) uses a monospace/tabular font for alignment in tables.

---

## 4. Landing Page Structure

A single-scroll, minimal marketing page — formal tone, no stock-photo clutter.

```
┌───────────────────────────────────────────────┐
│  NAV: Dayflow logo   Features  Pricing  [Sign In] [Get Started] │
├───────────────────────────────────────────────┤
│                                                   │
│              HERO SECTION                        │
│   "Every workday, perfectly aligned."             │
│   Subheading: one-line product description        │
│   [Get Started →]   [View Demo]                   │
│   (Framer Motion: fade+slide-up on load,           │
│    subtle floating dashboard preview mockup)        │
│                                                   │
├───────────────────────────────────────────────┤
│         TRUST STRIP (logos / stat counters)        │
├───────────────────────────────────────────────┤
│                                                   │
│   FEATURE SECTION (3-column grid, icon + text)     │
│   • Attendance, in one tap                         │
│   • Leave approvals without the back-and-forth      │
│   • Payroll clarity, always visible                  │
│   (Framer Motion: staggered fade-in on scroll)      │
│                                                   │
├───────────────────────────────────────────────┤
│                                                   │
│   PRODUCT SHOWCASE (animated dashboard screenshot   │
│   / interactive mock with scroll-triggered motion)  │
│                                                   │
├───────────────────────────────────────────────┤
│                                                   │
│   WHY DAYFLOW (comparison strip vs. legacy HR tools) │
│   Simple 3-column: "Legacy HRMS" vs "Dayflow"        │
│                                                   │
├───────────────────────────────────────────────┤
│                                                   │
│   AI SECTION — "Your HR assistant, built in"        │
│   Short demo of chatbot answering a leave question    │
│                                                   │
├───────────────────────────────────────────────┤
│   CTA BAND: "Set up Dayflow before your next standup" │
│   [Get Started →]                                  │
├───────────────────────────────────────────────┤
│   FOOTER: minimal — product, company, legal links    │
└───────────────────────────────────────────────┘
```

**Hero visual treatment:** a single softly-elevated card showing a simplified dashboard preview (attendance ring + leave status pill), animated with a gentle parallax float — this is the *only* decorative flourish on the page; everything else is typography and whitespace.

---

## 5. Component Design System

### 5.1 Core Components
- **Buttons:** Solid accent (primary), outline (secondary), ghost (tertiary). Rounded corners `8px`. Height 40px (default), 48px (hero CTA).
- **Cards:** White surface, `1px` `--border-subtle`, `12px` radius, `16–24px` padding, no shadow at rest; `2px` soft shadow on hover for interactive cards.
- **Status Pills:** Rounded-full, small text-label, colored background at 10% opacity of the semantic color + colored text (e.g., Approved = light green bg, dark green text).
- **Tables:** Zebra-free (all rows white), row hover = `--bg-elevated`, sticky header on scroll, right-aligned numeric columns.
- **Forms/Inputs:** Single-line bottom-border-only inputs OR soft-bordered boxes (12px radius) — consistent across onboarding and profile edit forms. Clear inline validation (no red until blur/submit).
- **Modals:** Centered, `16px` radius, backdrop blur, Framer Motion scale+fade entrance (`0.95 → 1`, 150ms).
- **Navigation (Dashboard Shell):** Left sidebar (collapsed icon rail on mobile → bottom nav), minimal icon set (Lucide icons), active state = accent-colored left border + subtle background tint.

### 5.2 Iconography
- Single icon family throughout (e.g., Lucide) — outline style, 1.5px stroke, no filled icons except for status indicators.

---

## 6. Key Screen Layouts

### 6.1 Employee Dashboard
```
┌─ Sidebar ─┬───────────────── Main ─────────────────┐
│ Dashboard │  Good morning, Arjun 👋                  │
│ Profile   │  ┌────────────┐ ┌────────────┐          │
│ Attendance│  │ Check-in    │ │ Leave       │          │
│ Leave     │  │ status card │ │ balance card│          │
│ Payslips  │  └────────────┘ └────────────┘          │
│ Logout    │                                            │
│           │  Recent Activity                          │
│           │  ─────────────────────────────            │
│           │  • Leave approved for Aug 24–25            │
│           │  • Payslip for July available               │
└───────────┴────────────────────────────────────────────┘
```
- Check-in card is the single most prominent element — one large button, animates (checkmark morph) on successful check-in.
- Leave balance shown as a minimal horizontal bar per leave type, not a busy pie chart.

### 6.2 Admin Dashboard
```
┌─ Sidebar ─┬───────────────── Main ─────────────────┐
│ Dashboard │  Overview                                 │
│ Employees │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐    │
│ Attendance│  │ 128   │ │ 96%   │ │ 5     │ │ ₹42L  │    │
│ Approvals │  │Employ.│ │Attend.│ │Pending│ │Payroll│    │
│ Payroll   │  └──────┘ └──────┘ └──────┘ └──────┘    │
│ Reports   │                                            │
│           │  Pending Leave Approvals            [View]│
│           │  ─────────────────────────────            │
│           │  Priya S. — Sick Leave — Aug 25–26         │
│           │  [AI summary: "2-day sick leave, doctor    │
│           │   note attached"]      [Approve] [Reject]  │
└───────────┴────────────────────────────────────────────┘
```
- Stat cards use large tabular numerals, minimal labels, no unnecessary icons.
- AI-generated leave summary shown as a subtly-tinted inline note (not a chat bubble) to keep the formal tone — clearly labeled "AI summary" for transparency.

### 6.3 Onboarding Wizard
- Single-column, centered card (max-width 560px), progress indicator as thin top bar (not numbered circles) for a clean, formal feel.
- Framer Motion horizontal slide transition between steps (`x: 20 → 0`, fade).
- "Save and continue later" always visible as a low-emphasis text link.

---

## 7. Motion Guidelines (Framer Motion)

| Interaction | Motion |
|---|---|
| Page/route transition | Fade + 8px slide-up, 200ms, ease-out |
| Card hover | Scale 1 → 1.01, shadow fade-in, 150ms |
| Button press | Scale 1 → 0.97, 80ms |
| Status change (e.g., leave approved) | Pill color-morph + subtle scale pulse |
| Modal open/close | Scale 0.95→1 + fade, backdrop fade, 150ms |
| Onboarding step change | Horizontal slide (20px) + fade, 250ms |
| Dashboard stat cards on load | Staggered fade-up, 60ms delay per card |
| Toast/notification | Slide in from top-right, auto-dismiss fade after 4s |

**Rule:** All durations stay under 300ms. Nothing loops or auto-plays continuously — motion is always a *response* to user action or page load, reinforcing the formal, non-gimmicky tone.

---

## 8. Responsive & Accessibility

- **Breakpoints:** mobile (< 640px, bottom nav), tablet (640–1024px, collapsible sidebar), desktop (> 1024px, full sidebar).
- **Contrast:** All text meets WCAG AA contrast against its background (verified against the palette in Section 2).
- **Keyboard navigation:** All interactive elements reachable via Tab; visible focus ring (`2px` accent outline offset `2px`).
- **Reduced motion:** Respect `prefers-reduced-motion` — disable non-essential Framer Motion transitions (keep only opacity fades) for users who opt out.
- **Status without color:** Every status pill pairs color with a text label (never a color-only dot) for color-blind accessibility.

---

## 9. Why This Design Wins vs. Workday / BambooHR

| | Workday | BambooHR | Dayflow |
|---|---|---|---|
| Visual density | High — many nested panels | Medium — icon-heavy cards | **Low — one focus per screen** |
| Color usage | Corporate blue + heavy chrome | Multiple bright accent colors | **Single accent + neutral base** |
| Motion/feedback | Minimal, page-reload heavy | Basic transitions | **Purposeful micro-interactions (Framer Motion)** |
| Onboarding experience | Consultant-configured, form-heavy | Multi-page wizard, dated UI | **Guided, resumable, animated single-flow wizard** |
| Overall feel | Enterprise software | Functional SaaS | **Modern, calm, trustworthy product** |

The result is an interface that feels less like "software you're forced to use" and more like a product employees *want* to open each morning — directly supporting Dayflow's core positioning as a fast, modern, AI-augmented alternative to legacy HR platforms.
