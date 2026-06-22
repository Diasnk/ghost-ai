# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Shape-specific canvas node rendering — complete

## Current Goal

- Custom edge rendering and canvas controls (next canvas features).

## Completed

- `01-design-system` — shadcn/ui configured, `lib/utils.ts` with `cn()`, lucide-react installed, and Button / Card / Dialog / Input / Tabs / Textarea / ScrollArea added under `components/ui/`. Dark theme tokens mapped in `globals.css`.
- `02-editor` — editor navbar, floating project sidebar shell, editor layout wrapper, and reusable dialog content pattern implemented.
- `03-auth` — `@clerk/ui` installed; `ClerkProvider` with dark theme + CSS variable overrides; root `proxy.ts` route protection; sign-in/sign-up pages with two-panel auth layout; `/editor` route; authenticated `/` redirect; `UserButton` in editor navbar. Verified with `npm run build`, `npm run lint`, and local auth smoke tests.
- `04-project-dialogs` — editor home with heading, description, and `New Project` button; Create / Rename / Delete dialogs via `EditorDialogContent`; `useProjectDialogs` hook for dialog, form, and loading state; mock in-memory projects with owned/shared gating; sidebar rename/delete actions on owned projects only; mobile sidebar backdrop scrim; slug preview on create. Verified with `npm run lint` and `npx tsc --noEmit`.
- `05-prisma` — `Project` and `ProjectCollaborator` models in `prisma/models/project.prisma` with `ProjectStatus` enum, relations, indexes, and cascade delete; cached `lib/prisma.ts` singleton branching on `DATABASE_URL` (`prisma+postgres://` → Accelerate, otherwise `@prisma/adapter-pg`); initial migration `20260608191953_init` applied; client generated to `app/generated/prisma`. Verified with `npx prisma validate` and `npm run build`.
- `06-project-apis` — REST project routes at `app/api/projects/route.ts` (GET list, POST create) and `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE); `lib/require-auth.ts` for Clerk `401` gate; `lib/projects.ts` for owner lookup with `403`/`404` on mutations. Create defaults missing name to `Untitled Project`. Verified with `npm run build`.
- `07-wire-editor-home` — server-side owned/shared project fetch in `app/editor/layout.tsx` via `getEditorProjectLists()`; `useProjectActions` hook for dialog state and API mutations (create/rename/delete); `lib/room-id.ts` for slug + suffix room IDs aligned with project IDs; POST `/api/projects` accepts optional `id`; sidebar and dialogs wired to real data; create navigates to `/editor/[projectId]`; delete refreshes or redirects from active workspace; minimal workspace placeholder at `app/editor/[projectId]/page.tsx`. Verified with `npm run build`.
- `08-editor-workspace-shell` — `lib/project-access.ts` with `getClerkIdentity()` and `findProjectForUser()` (owner or collaborator); `AccessDenied` for missing/unauthorized projects; editor layout refactored to provider-only with separate home (`EditorLayout`) and workspace (`EditorWorkspaceShell`) chrome; workspace server layout at `app/editor/[projectId]/layout.tsx`; navbar project name + share/AI toggles; sidebar active-project highlighting and navigation links; canvas and AI sidebar placeholders. Verified with `npm run build`.
- `09-share-dialog` — collaborator REST routes at `app/api/projects/[projectId]/collaborators` (GET list, POST invite) and `.../collaborators/[collaboratorId]` (DELETE remove); `lib/collaborators.ts` + `lib/clerk-users.ts` for Prisma email storage and Clerk Backend enrichment (display name + avatar); `ShareProjectDialog` + `useShareDialog` wired to navbar Share button; owners can invite/remove/copy link; collaborators get read-only list; access list shows workspace owner with role badges. Verified with `npm run build`.
- `10-liveblocks-setup` — `liveblocks.config.ts` with `Presence` (cursor, `isThinking`) and `UserMeta` (name, avatarURL, color); cached `@liveblocks/node` client in `lib/liveblocks.ts` with `ensureLiveblocksRoom()`; deterministic cursor color helper in `lib/cursor-color.ts`; `POST /api/liveblocks-auth` gates on Clerk auth + `findProjectForUser()`, creates room if needed, grants per-user write access, and issues ID tokens with user metadata via `identifyUser`. Verified with `npm run build`.
- `11-base-canvas` — `types/canvas.ts` with node color palette, shapes, and `canvasNode`/`canvasEdge` type constants; `CanvasRoom` client wrapper (`LiveblocksProvider`, `RoomProvider`, `ClientSideSuspense`, error boundary); `ProjectCanvas` with `useLiveblocksFlow` (empty initial state, suspense), React Flow (`ConnectionMode.Loose`, `fitView`, `MiniMap`, dot `Background`); server workspace page wires room ID from params. Verified with `npm run build`.
- `12-shape-panel` — floating pill `ShapePanel` with draggable Lucide icons for all six shapes; `lib/canvas-shape-defaults.ts` (per-shape default sizes + drag payload helpers) and `lib/canvas-node-id.ts` (shape-timestamp-counter IDs); `CanvasNode` basic bordered-rectangle renderer registered as `canvasNode`; `ProjectCanvas` drop handlers (`onDragOver`/`onDrop`) with `screenToFlowPosition` + `addNodes` for empty-label default-color nodes. Verified with `npm run build`.
- Shape-specific rendering — `lib/resolve-node-shape.ts` for safe `data.shape` fallback; `components/editor/canvas-node-shape.tsx` renders rectangle/circle via CSS and diamond/pill/cylinder/hexagon via inline SVG; `CanvasNode` delegates to shape renderer while preserving label overlay and Liveblocks sync. Vitest unit tests for drag payload parsing and shape resolution. Verified with `npx tsc --noEmit`, `npm test`, and `npm run build`.

## In Progress

- None.

## Next Up

- Custom edge rendering and canvas controls.

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
- Collaborator sharing is served by `app/api/projects/[projectId]/collaborators/*`. GET requires project membership via `findProjectForUser()`; invite/remove require ownership via `findProjectForOwner()`. Collaborators are stored by normalized email in `ProjectCollaborator`; display names and avatars are enriched at read time from Clerk Backend API (`lib/clerk-users.ts`). No local user table.
- Liveblocks room ID equals project ID. Tokens are issued at `POST /api/liveblocks-auth` only after `findProjectForUser()` succeeds. `ensureLiveblocksRoom()` calls `getOrCreateRoom` (private by default) then `updateRoom` to grant the requesting user `room:write`. Session metadata (name, avatarURL, cursor color) is attached via `identifyUser` ID tokens. Requires `LIVEBLOCKS_SECRET_KEY` and `@liveblocks/node`.
- Canvas node/edge schema lives in `types/canvas.ts` (`CanvasNodeData`: label, color, shape; types `canvasNode`/`canvasEdge`). Flow state syncs via `useLiveblocksFlow` into Liveblocks Storage (default `"flow"` key). Workspace page stays server-side; `CanvasRoom` + `ProjectCanvas` are client components.
- Shape panel drag-drop uses `application/ghostai-shape` MIME payload (`lib/canvas-shape-defaults.ts`) with per-shape default dimensions. Drops create `canvasNode` entries via `useReactFlow().addNodes`, which sync through Liveblocks via `onNodesChange`. Node IDs follow `{shape}-{timestamp}-{counter}` (`lib/canvas-node-id.ts`). `CanvasNode` reads `data.shape` via `resolveNodeShape()` and renders shape-specific visuals in `canvas-node-shape.tsx`; legacy nodes without `shape` default to `rectangle`.

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
- `09-share-dialog`: share dialog opens from workspace navbar; owner invite/remove/copy-link and collaborator read-only list implemented; Clerk enrichment for known users; verified with `npm run build`.
- `10-liveblocks-setup`: `@liveblocks/node` installed; auth route at `/api/liveblocks-auth`; `LIVEBLOCKS_SECRET_KEY` required in environment; verified with `npm run build`.
- `11-base-canvas`: replaced canvas placeholder with Liveblocks-backed React Flow; shared types in `types/canvas.ts`; verified with `npm run build`.
- `12-shape-panel`: shape panel toolbar, drag-to-drop node creation, and basic `CanvasNode` renderer; verified with `npm run build`.
- Shape-specific rendering: `CanvasNodeShape` + `resolveNodeShape`; vitest tests for payload parsing and shape fallback; verified with `npx tsc --noEmit`, `npm test`, and `npm run build`.
