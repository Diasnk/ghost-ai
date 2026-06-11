# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor workspace shell (`08-editor-workspace-shell`) — complete

## Current Goal

- Next feature unit after workspace shell (likely canvas / Liveblocks integration).

## Completed

- `01-design-system` — shadcn/ui configured, `lib/utils.ts` with `cn()`, lucide-react installed, and Button / Card / Dialog / Input / Tabs / Textarea / ScrollArea added under `components/ui/`. Dark theme tokens mapped in `globals.css`.
- `02-editor` — editor navbar, floating project sidebar shell, editor layout wrapper, and reusable dialog content pattern implemented.
- `03-auth` — `@clerk/ui` installed; `ClerkProvider` with dark theme + CSS variable overrides; root `proxy.ts` route protection; sign-in/sign-up pages with two-panel auth layout; `/editor` route; authenticated `/` redirect; `UserButton` in editor navbar. Verified with `npm run build`, `npm run lint`, and local auth smoke tests.
- `04-project-dialogs` — editor home with heading, description, and `New Project` button; Create / Rename / Delete dialogs via `EditorDialogContent`; `useProjectDialogs` hook for dialog, form, and loading state; mock in-memory projects with owned/shared gating; sidebar rename/delete actions on owned projects only; mobile sidebar backdrop scrim; slug preview on create. Verified with `npm run lint` and `npx tsc --noEmit`.
- `05-prisma` — `Project` and `ProjectCollaborator` models in `prisma/models/project.prisma` with `ProjectStatus` enum, relations, indexes, and cascade delete; cached `lib/prisma.ts` singleton branching on `DATABASE_URL` (`prisma+postgres://` → Accelerate, otherwise `@prisma/adapter-pg`); initial migration `20260608191953_init` applied; client generated to `app/generated/prisma`. Verified with `npx prisma validate` and `npm run build`.
- `06-project-apis` — REST project routes at `app/api/projects/route.ts` (GET list, POST create) and `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE); `lib/require-auth.ts` for Clerk `401` gate; `lib/projects.ts` for owner lookup with `403`/`404` on mutations. Create defaults missing name to `Untitled Project`. Verified with `npm run build`.
- `07-wire-editor-home` — server-side owned/shared project fetch in `app/editor/layout.tsx` via `getEditorProjectLists()`; `useProjectActions` hook for dialog state and API mutations (create/rename/delete); `lib/room-id.ts` for slug + suffix room IDs aligned with project IDs; POST `/api/projects` accepts optional `id`; sidebar and dialogs wired to real data; create navigates to `/editor/[projectId]`; delete refreshes or redirects from active workspace; minimal workspace placeholder at `app/editor/[projectId]/page.tsx`. Verified with `npm run build`.
- `08-editor-workspace-shell` — `lib/project-access.ts` with `getClerkIdentity()` and `findProjectForUser()` (owner or collaborator); `AccessDenied` for missing/unauthorized projects; editor layout refactored to provider-only with separate home (`EditorLayout`) and workspace (`EditorWorkspaceShell`) chrome; workspace server layout at `app/editor/[projectId]/layout.tsx`; navbar project name + share/AI toggles; sidebar active-project highlighting and navigation links; canvas and AI sidebar placeholders. Verified with `npm run build`.

## In Progress

- None.

## Next Up

- Canvas / Liveblocks integration.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- `/` is protected by `proxy.ts`; unauthenticated users are redirected to sign-in by Clerk middleware. Authenticated users hitting `/` are redirected to `/editor` in `app/page.tsx`.
- Public routes are derived from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (fallback `/sign-in`, `/sign-up`).
- Editor routes use `app/editor/layout.tsx` (server) to fetch owned and shared projects via `getEditorProjectLists()` and pass `initialProjects` to `EditorProjectsProvider` → `useProjectActions`. Home (`/editor`) wraps content in `EditorLayout`; workspace (`/editor/[projectId]`) uses server layout access checks and `EditorWorkspaceShell`. No client-side fetch on initial load.
- Project ID and Liveblocks room ID are aligned: create generates `{slugified-name}-{6-char-suffix}` via `generateRoomId()` and passes it as `id` to `POST /api/projects`.
- Project CRUD is served by `app/api/projects/*`. `requireAuth()` enforces `401` on unauthenticated requests; `findProjectForOwner()` enforces owner-only PATCH/DELETE with `403` for non-owners. List endpoint scopes to `ownerId` matching the authenticated Clerk user.
- Shared projects are resolved via `ProjectCollaborator.email` matched to the Clerk user's primary email.
- Workspace access is enforced in `app/editor/[projectId]/layout.tsx` via `findProjectForUser()` (owner or collaborator by email). Missing or unauthorized projects render `AccessDenied` with a link back to `/editor`.
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
- `06-project-apis`: routes registered at `/api/projects` and `/api/projects/[projectId]`; `npm run build` passes with both API routes listed as dynamic handlers.
- `07-wire-editor-home`: replaced `useProjectDialogs` mock hook with `useProjectActions`; removed `lib/mock-projects.ts`; create dialog shows live room ID preview with stable suffix per dialog open.
- `08-editor-workspace-shell`: verified with `npm run build`; `npx tsc --noEmit` passes.
