---
name: fullstack-scaffold
description: Work with this React + Vite + Tailwind + shadcn web app and Express API server. Use when adding UI, routes, or endpoints in this monorepo.
---

# Fullstack Scaffold Skill

This repo has two apps: `web/` (frontend) and `server/` (backend). Keep them decoupled — frontend talks to backend only via `VITE_API_URL`.

## Web — React + Vite + Tailwind v4 + shadcn

- Entry: `src/main.jsx` imports `src/index.css` + `src/App.jsx`.
- Styling: Tailwind utilities only. Theme tokens live in `src/index.css` (`@theme inline`). Use `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `border-border`. Never hardcode hex for surfaces/text.
- Alias: always `@/components/...`, `@/lib/utils`. Configured in `vite.config.js` (`import.meta.dirname`) + `jsconfig.json`. Don't change to `__dirname` — Vite 8 warns.
- `cn()` helper: `import { cn } from "@/lib/utils"` for conditional classes.
- shadcn: new components go in `src/components/ui/<name>.jsx`. Copy the `button.jsx` pattern:
  - `cva` for `variants`/`sizes` + `defaultVariants`
  - `Slot` for `asChild`, `React.forwardRef`, `displayName`
  - `cn(buttonVariants({ variant, size, className }))`
- Icons: `lucide-react` only.
- Env: `import.meta.env.VITE_API_URL` for API calls, fallback `http://localhost:5000`.

### Web workflow

1. Read `src/App.jsx` + target `src/components/ui/*.jsx` before editing.
2. Add/edit component in `src/components/ui/`, consume in page/component.
3. Run `cd web && npm run build` — must pass.

## Server — Express API (ESM)

- Entry: `src/index.js` — `cors()`, `express.json()`, mounts `apiRoutes` at `/api`. Port from `process.env.PORT || 5000`.
- Routes: `src/routes/index.js` — `GET /` → `{ message, success }`, `GET /health` → `{ status: "ok", uptime }`. Add new resources as `src/routes/<name>.js` + `app.use("/api/<name>", ...)` — never put `app.listen` outside `src/index.js`.
- Responses: JSON only — success `{ success: true, data }`, error `{ success: false, message }` with correct status code.
- ESM: `import/express from "express"`, add `.js` extension on local imports.

### Server workflow

1. Read `src/index.js` + `src/routes/index.js` before adding endpoints.
2. Add route, keep handler thin (validate → respond).
3. Verify: `cd server && npm run dev`, then `curl localhost:5000/api[/health]`.

## Don'ts

- Don't add TS, CommonJS, CSS files, or new styling systems.
- Don't edit `dist/`, `node_modules/`, commit `.env`.
- Don't install deps (`axios`, `zod`, routers) without need — use `fetch`, native validation, existing libs.
