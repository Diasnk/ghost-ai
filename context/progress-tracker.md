# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Auth (`03-auth`) — complete and verified locally

## Current Goal

- Next feature unit after auth verification.

## Completed

- `01-design-system` — shadcn/ui configured, `lib/utils.ts` with `cn()`, lucide-react installed, and Button / Card / Dialog / Input / Tabs / Textarea / ScrollArea added under `components/ui/`. Dark theme tokens mapped in `globals.css`.
- `02-editor` — editor navbar, floating project sidebar shell, editor layout wrapper, and reusable dialog content pattern implemented.
- `03-auth` — `@clerk/ui` installed; `ClerkProvider` with dark theme + CSS variable overrides; root `proxy.ts` route protection; sign-in/sign-up pages with two-panel auth layout; `/editor` route; authenticated `/` redirect; `UserButton` in editor navbar. Verified with `npm run build`, `npm run lint`, and local auth smoke tests.

## In Progress

- None.

## Next Up

- Next feature unit after auth verification.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- `/` is protected by `proxy.ts`; unauthenticated users are redirected to sign-in by Clerk middleware. Authenticated users hitting `/` are redirected to `/editor` in `app/page.tsx`.
- Public routes are derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (fallback `/sign-in`, `/sign-up`).

## Session Notes

- `02-editor` verified with `npm run lint` and `npx tsc --noEmit`.
- `03-auth` verified with `npm run build` and `npm run lint`.
- Auth pages updated to 50/50 split layout: left brand panel (`bg-surface`) with logo, headline, icon feature list, and footer; right form panel (`bg-base`). Geist Sans applied to app body and Clerk appearance variables.
- Fixed Clerk redirecting to hosted `accounts.dev` instead of local auth pages by adding standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, and fallback redirect env vars; wired `routing="path"` on SignIn/SignUp and sign-in/sign-up URLs on ClerkProvider + proxy.
- Clerk browser console message "loaded with development keys" is expected for local dev (`pk_test_*` keys). Not an error; auth flow works correctly. Use `pk_live_*` / `sk_live_*` only in production deploy env.
- Auth smoke tests passed: unauthenticated `/` and `/editor` redirect to `/sign-in`; `/sign-in` and `/sign-up` return 200 with path-based Clerk UI; authenticated `/` redirects to `/editor`.
