# Insighta Web Portal (Next.js)

This frontend consumes the existing Stage 3 backend APIs without changing backend architecture.

## Stack

- Next.js 14 (App Router)
- React 18
- Vanilla JavaScript

## Run

1. Install dependencies:
   - npm install
2. Set backend URL:
   - NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:3000
3. Start dev server:
   - npm run dev

## Frontend Architecture

- app/login/page.js
  - GitHub login page that starts backend OAuth PKCE flow.
- app/(protected)/dashboard/page.js
  - Protected dashboard and role summary.
- app/(protected)/profiles/page.js
  - Advanced filter UI and profile list.
- app/(protected)/profiles/[id]/page.js
  - Profile detail view.
- app/(protected)/profiles/search/page.js
  - Dedicated natural language profile search page.
- app/(protected)/account/page.js
  - Account page using backend auth/me.
- app/(protected)/export/page.js
  - Admin-oriented CSV export UI + CSRF-protected logout action.
- app/api/portal/csrf/route.js
  - Generates CSRF token and same-site cookie.
- app/api/portal/logout/route.js
  - Validates CSRF token and proxies logout to backend.
- middleware.js
  - Route guard for protected pages.
- lib/backend.js
  - API integration layer for backend requests.
- lib/csrf.js
  - CSRF token creation/verification helpers.

## Auth Flow (HTTP-only cookie backend auth)

1. Login page links to backend `/auth/github?client=browser`.
2. Backend performs GitHub OAuth PKCE and sets HTTP-only auth cookies.
3. Portal probes backend `/auth/me` to confirm session and role.
4. On success, portal sets lightweight UI session cookie for frontend route protection.

Note: Authentication authority remains backend cookies; portal session cookie only gates frontend navigation.

## CSRF Protection

- Portal issues CSRF token from /api/portal/csrf.
- Token is stored in cookie portal_csrf and returned in JSON.
- Sensitive portal mutation route /api/portal/logout requires matching x-csrf-token header.
- On success, route proxies backend logout and clears portal session cookies.

## API Integration Layer

The portal calls existing backend endpoints directly:

- /api/profiles
- /api/profiles/search
- /api/profiles/export
- /auth/github
- /auth/logout
- /auth/me

No filter engine duplication in frontend: the backend queryBuilder and nlParser remain source-of-truth.

## Role-aware UI Logic

- Role detected by probing `/auth/me`:
  - role = `admin` or `analyst` from backend user payload
- UI gating:
  - Analyst: dashboard and profile querying/search
  - Admin: plus CSV export and admin actions surface

## Stage 3 CI/CD (Grading)

- Workflow template: `.github/workflows/portal-ci-cd.yml`
- Pipeline gates: `lint` -> `test` -> `build` -> `deploy`
- Deploy target: Vercel production on push to `main`
- Required repository secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

## Stage 3 Submission Checklist (Portal)

- Protected pages documented (login, dashboard, profile search, advanced filters, export)
- HTTP-only cookie auth flow documented
- CSRF protection flow documented
- Role-aware UI behavior documented (admin vs analyst)
- CI/CD and deployment requirements documented

## Stage 2 vs Stage 3 Diff

- Stage 2: backend API only
- Stage 3: browser portal with login, dashboard, advanced filters, profile detail, account, NL search, CSV export
- Portal consumes backend auth endpoints under `/auth/*` and profile endpoints under `/api/profiles*` instead of duplicating query logic
- Cookie auth, CSRF protection, and role-aware UI are frontend additions only
