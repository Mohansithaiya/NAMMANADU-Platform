# NAMMANADU (நம்ம நாடு) — Project Roadmap

**AI-Powered Civic Governance Platform for Tamil Nadu**

---

# Vision

To build a digital public infrastructure layer for Tamil Nadu where every citizen — regardless of location, literacy level, or technical familiarity — can report civic issues, track government scheme eligibility, and hold local administration accountable through a transparent, AI-assisted platform. NAMMANADU envisions a state where the distance between a citizen's grievance and its resolution is measured in days, not months.

---

# Mission

To reduce the friction between citizens and local governance by combining AI-assisted complaint processing, real-time transparency, and role-based accountability — starting with a working, hostable prototype and evolving toward a system credible enough for pilot adoption by a municipal body, ward office, or civic-tech NGO.

---

# Problem Statement

Tamil Nadu's civic grievance redressal today is fragmented across phone helplines, physical ward offices, and disconnected department portals. This creates three recurring failures:

1. **No unified reporting channel** — citizens don't know which department to approach for a given issue (garbage, water, roads, streetlights), leading to delays or complaints never reaching the right desk.
2. **No visibility after submission** — once a complaint is filed, citizens have no way to track status, leading to repeated visits, phone calls, or complete abandonment of the issue.
3. **No structured intelligence layer** — departments manually triage, categorize, and prioritize complaints, and citizens are rarely informed proactively about government schemes they are eligible for.

NAMMANADU addresses this by combining a citizen-facing complaint system with an AI layer that auto-categorizes, prioritizes, and routes issues, plus a scheme-eligibility engine that surfaces relevant welfare programs to citizens without them having to search for it.

---

# Target Users

| User Role | Description |
|---|---|
| **Citizen** | Any resident of Tamil Nadu who wants to report a civic issue, track its resolution, or check scheme eligibility. |
| **Department Worker** | Ground-level government staff (e.g., sanitation, water board, electricity) responsible for resolving assigned complaints. |
| **Ward/Local Admin** | Officials who oversee complaint routing, worker assignment, and performance within a ward or zone. |
| **Super Admin** | Platform-level administrator with visibility across all wards, departments, and system-wide analytics. |

---

# Core Features

- **AI-Assisted Complaint Filing** — Citizens describe an issue in free text (or regional language); AI auto-formats, categorizes department, and assigns urgency.
- **Real-Time Status Tracking** — Citizens can track complaint status (Filed → Assigned → In Progress → Resolved) with live updates.
- **Role-Based Dashboards** — Separate, purpose-built views for citizens, department workers, ward admins, and super admins.
- **Scheme Eligibility Engine** — AI evaluates citizen profile data against known government scheme criteria and surfaces relevant matches.
- **Fraud & Duplicate Detection** — AI flags duplicate or suspicious complaints to reduce noise for department workers.
- **Real-Time Notifications** — Citizens and workers are notified instantly on status changes via in-app/socket-based alerts.
- **Transparency Dashboard** — Public-facing aggregate view of complaint volumes, resolution times, and department performance by ward.
- **Multilingual Support** — Tamil and English interface to maximize accessibility across the target user base.

---

# Non Functional Requirements

- Responsive on Mobile, Tablet and Desktop
- Fast page load (<2 seconds)
- Secure authentication
- Accessible UI
- Tamil + English support
- Scalable architecture
- Modular components
- Production-ready deployment

---

# Development Phases

## Phase 1 — Foundation & Core Architecture

**Objective**
Establish the technical foundation: authentication, data models, and base infrastructure that every later feature depends on.

**Deliverables**
- Finalized system architecture diagram (frontend, backend, database, AI layer)
- User authentication system (JWT with refresh token rotation) supporting all four roles
- Core database schema (users, complaints, departments, wards)
- Basic role-based routing and access control
- Project repository structured for collaborative, production-grade development

**Expected Outcome**
A secure, working skeleton application where a user can register, log in by role, and land on an empty but correctly-gated dashboard. No AI or complaint logic yet — this phase proves the foundation is solid.

---

## Phase 2 — Citizen Complaint System (Core Loop)

**Objective**
Build the primary citizen-facing loop: file a complaint, see it processed, track its status.

**Deliverables**
- Complaint submission form (text + optional image/location)
- Complaint listing and detail views for citizens
- Manual (non-AI) department routing and status workflow
- Department worker dashboard to view and update assigned complaints
- Basic notification system for status changes

**Expected Outcome**
A citizen can file a real complaint, a department worker can see and act on it, and the citizen can track it end-to-end. This is the minimum viable civic-tech product, functional without AI.

---

## Phase 3 — AI Intelligence Layer

**Objective**
Layer AI on top of the working core loop to automate what was manual in Phase 2.

**Deliverables**
- AI-based complaint formatting and auto-categorization (department + urgency)
- AI-based scheme eligibility matching engine
- AI-based duplicate/fraud detection on incoming complaints
- Admin-facing override controls (AI suggests, human confirms)

**Expected Outcome**
The platform now meaningfully reduces manual triage work — complaints are pre-sorted and prioritized before a human ever looks at them, and citizens receive proactive scheme recommendations. This is the differentiator that elevates the project beyond a generic CRUD grievance app.

---

## Phase 4 — Admin, Analytics & Transparency

**Objective**
Give ward admins and super admins the visibility and tools needed to actually manage the system, and expose transparency data publicly.

**Deliverables**
- Ward Admin dashboard (worker assignment, ward-level complaint analytics)
- Super Admin dashboard (cross-ward analytics, department performance, system health)
- Public transparency dashboard (aggregate stats, no personal data exposed)
- Exportable reports (resolution time, complaint volume by category/ward)

**Expected Outcome**
NAMMANADU becomes a governance tool, not just a citizen app — administrators can identify bottlenecks, and the public can independently verify department performance, building the accountability layer the project is named for.

---

## Phase 5 — Hardening, Polish & Public Launch

**Objective**
Take the platform from "working prototype" to "credible, publicly hostable, resume-defensible product."

**Deliverables**
- Security review (auth hardening, input validation, rate limiting)
- UI/UX polish pass across all four role dashboards
- Performance optimization (query indexing, image/media handling, load testing)
- Multilingual (Tamil/English) content pass
- Public deployment with custom domain, monitoring, and uptime tracking
- Demo dataset / seeded ward for live demonstration purposes

**Expected Outcome**
A publicly accessible, professionally polished platform that can be demonstrated live in interviews and hackathons, with no rough edges that undermine credibility during a technical deep-dive.

---

# Success Metrics

- Complaint submission time
- Average response time
- Resolution rate
- Daily active users
- AI categorization accuracy
- Average page load time
- User satisfaction

---

# Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB |
| Authentication | JWT with refresh token rotation |
| AI Layer | Google Gemini API (complaint formatting, categorization, eligibility, fraud detection) |
| Real-Time Layer | Socket.io |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Render / Railway |
| Media Storage | Cloudinary or equivalent object storage |
| Monitoring | Uptime Robot / basic logging + error tracking |

---

# Folder Structure

```
nammanadu/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── pages/             # Route-level pages per role
│   │   ├── layouts/           # Role-based dashboard layouts
│   │   ├── context/           # Auth & global state
│   │   ├── services/          # API client functions
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
│
├── server/                    # Node.js/Express backend
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API route definitions
│   ├── controllers/           # Route logic
│   ├── middleware/            # Auth, validation, error handling
│   ├── services/
│   │   ├── ai/                 # Gemini AI service layer
│   │   └── notifications/      # Socket.io event handling
│   └── config/
│
├── docs/                      # Architecture diagrams, API docs
├── PROJECT-ROADMAP.md
└── README.md
```

---

# Deployment Plan

1. **Environment Separation** — Maintain distinct `development`, `staging`, and `production` environments with separate environment variables and database instances.
2. **Frontend Deployment** — Deploy the React/Vite client to Vercel with automatic deployments tied to the main branch.
3. **Backend Deployment** — Deploy the Express API to Render or Railway with health-check endpoints and auto-restart on failure.
4. **Database Hosting** — Use MongoDB Atlas (managed cluster) with automated backups enabled.
5. **Domain & SSL** — Acquire a custom domain and enforce HTTPS across frontend and backend.
6. **CI/CD** — Set up GitHub Actions for lint/build checks on pull requests before merge to main.
7. **Monitoring** — Add uptime monitoring and basic error logging (e.g., Sentry or equivalent) before public launch.
8. **Demo Readiness** — Seed a demo ward with realistic sample data so the platform can be explored live without requiring a real citizen account.

---

# Future Scope

- SMS/WhatsApp-based complaint filing for citizens without smartphone access
- Integration with actual Tamil Nadu government APIs/data sources (where publicly available)
- Voice-based complaint filing in Tamil for low-literacy users
- Predictive analytics — forecasting complaint hotspots by ward/season
- Mobile app (React Native) version of the citizen-facing module
- Pilot partnership with a local NGO, ward office, or civic-tech initiative for real-world validation
- Open API for civic-tech researchers and journalists to access anonymized public data

---

# Resume Impact

NAMMANADU is positioned as a **full-stack, AI-integrated, real-world civic-tech system** — not a tutorial clone — and should be framed on the resume around the following strengths:

- **System design depth**: four distinct role-based access levels, real-time architecture, and a genuine AI decision-making layer (categorization, eligibility, fraud detection) rather than a bolted-on chatbot.
- **Domain relevance**: directly demonstrates initiative on a public-interest problem, which stands out in placement interviews for both product-minded and engineering-minded roles.
- **End-to-end ownership**: architecture, backend, frontend, AI integration, and deployment — signals ability to own a project beyond just writing code.
- **Interview differentiator**: unlike generic CRUD apps, NAMMANADU's AI layer (auto-categorization, scheme matching, fraud detection) gives concrete, defensible talking points for "tell me about a challenging technical decision" style questions.
- **Public deployment**: a live, hosted link on the resume signals confidence and production-readiness that most student projects lack.

---

# DevLog Plan

DevLog 1 — Project Vision

DevLog 2 — UI Design

DevLog 3 — Authentication

DevLog 4 — Complaint Module

DevLog 5 — AI Integration

DevLog 6 — Scheme Engine

DevLog 7 — Dashboards

DevLog 8 — Deployment

DevLog 9 — Future Roadmap


**Recommended resume framing**: *"Built and deployed NAMMANADU, a full-stack civic governance platform for Tamil Nadu with AI-driven complaint categorization, scheme-eligibility matching, and real-time role-based dashboards for citizens, department workers, and administrators."*