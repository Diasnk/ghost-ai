# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Prisma setup (`05-prisma`) — complete

## Current Goal

- Next feature unit after Prisma setup.

## Completed

- `01-design-system` — shadcn/ui configured, `lib/utils.ts` with `cn()`, lucide-react installed, and Button / Card / Dialog / Input / Tabs / Textarea / ScrollArea added under `components/ui/`. Dark theme tokens mapped in `globals.css`.
- `02-editor` — editor navbar, floating project sidebar shell, editor layout wrapper, and reusable dialog content pattern implemented.
- `03-auth` — `@clerk/ui` installed; `ClerkProvider` with dark theme + CSS variable overrides; root `proxy.ts` route protection; sign-in/sign-up pages with two-panel auth layout; `/editor` route; authenticated `/` redirect; `UserButton` in editor navbar. Verified with `npm run build`, `npm run lint`, and local auth smoke tests.
- `04-project-dialogs` — editor home with heading, description, and `New Project` button; Create / Rename / Delete dialogs via `EditorDialogContent`; `useProjectDialogs` hook for dialog, form, and loading state; mock in-memory projects with owned/shared gating; sidebar rename/delete actions on owned projects only; mobile sidebar backdrop scrim; slug preview on create. Verified with `npm run lint` and `npx tsc --noEmit`.
- `05-prisma` — `Project` and `ProjectCollaborator` models in `prisma/models/project.prisma` with `ProjectStatus` enum, relations, indexes, and cascade delete; cached `lib/prisma.ts` singleton branching on `DATABASE_URL` (`prisma+postgres://` → Accelerate, otherwise `@prisma/adapter-pg`); initial migration `20260608191953_init` applied; client generated to `app/generated/prisma`. Verified with `npx prisma validate` and `npm run build`.

## In Progress

- None.

## Next Up

- Next feature unit after Prisma setup.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- `/` is protected by `proxy.ts`; unauthenticated users are redirected to sign-in by Clerk middleware. Authenticated users hitting `/` are redirected to `/editor` in `app/page.tsx`.
- Public routes are derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (fallback `/sign-in`, `/sign-up`).
- Project dialog and mock project state live in `useProjectDialogs`, provided via `EditorProjectsProvider` in `EditorLayout`. UI still uses mock data until a later persistence feature unit.
- `Project` and `ProjectCollaborator` metadata live in PostgreSQL via Prisma. `lib/prisma.ts` is the single database entry point; `ownerId` maps to Clerk user IDs; `canvasJsonPath` stores the Vercel Blob reference when a canvas exists.

## Session Notes

- `02-editor` verified with `npm run lint` and `npx tsc --noEmit`.
- `03-auth` verified with `npm run build` and `npm run lint`.
- Auth pages updated to 50/50 split layout: left brand panel (`bg-surface`) with logo, headline, icon feature list, and footer; right form panel (`bg-base`). Geist Sans applied to app body and Clerk appearance variables.
- Fixed Clerk redirecting to hosted `accounts.dev` instead of local auth pages by adding standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL`, and fallback redirect env vars; wired `routing="path"` on SignIn/SignUp and sign-in/sign-up URLs on ClerkProvider + proxy.
- Clerk browser console message "loaded with development keys" is expected for local dev (`pk_test_*` keys). Not an error; auth flow works correctly. Use `pk_live_*` / `sk_live_*` only in production deploy env.
- Auth smoke tests passed: unauthenticated `/` and `/editor` redirect to `/sign-in`; `/sign-in` and `/sign-up` return 200 with path-based Clerk UI; authenticated `/` redirects to `/editor`.
- `04-project-dialogs` checklist: sidebar actions wired; slug preview works; no TypeScript errors; no lint errors.
- `05-prisma`: fixed generator output path in `prisma/schema.prisma` from `..app/generated/prisma` to `../app/generated/prisma`; added `@prisma/extension-accelerate` for Accelerate URL branch.
