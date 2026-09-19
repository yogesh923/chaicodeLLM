# AGENTS.md — chaicodeLLM

Monorepo with `web/` (React + Vite + Tailwind v4 + shadcn) and `server/` (Express API, ESM).

## Active Scope (user-locked)

- Backend only: work in `server/` (API + business logic).
- Do NOT touch `web/` unless user explicitly mentions UI. No UI edits, refactors, or "improvements" on your own.

## Structure

- `web/` — frontend. `src/App.jsx`, `src/main.jsx`, `src/index.css`, `src/lib/utils.js` (`cn()`), `src/components/ui/` (shadcn components), `components.json`, `jsconfig.json` (`@/*` → `src/*`), `vite.config.js` (tailwind plugin + `@` alias via `import.meta.dirname`).
- `server/` — backend. `src/index.js` (entry, mounts `/api`), `src/routes/index.js` (routes only, no app logic).

## Run / Build

```bash
cd web && npm run dev      # http://localhost:5173
cd web && npm run build    # vite build
cd web && npm run preview  # preview dist
cd web && npm run lint     # oxlint

cd server && npm run dev   # --watch, http://localhost:5000 (/api, /api/health)
cd server && npm start     # production
```

Env: `web/.env` → `VITE_API_URL=http://localhost:5000` (see `.env.example`). `server/.env` → `PORT=5000`. Never commit `.env`.

## Code Style

- ESM only (`import`/`export`). No CommonJS, no TS unless user asks.
- Web: functional React components (`.jsx`), Tailwind utilities over custom CSS, `cn()` for conditional classes, `lucide-react` icons, `@/` imports (never deep relative `../../`). New shadcn UI goes in `src/components/ui/`, follow existing `button.jsx` pattern (cva + Slot + `cn`). Keep `src/index.css` theme tokens intact — use `bg-background text-foreground border-border` etc.
- Server: thin `src/index.js` (middleware, mount). All endpoints in `src/routes/`. Always `express.json()` + `cors()`. Respond JSON: `{ success/data }` or `{ message }`. No business logic in route files beyond basic handlers — extract to `src/services/` or `src/utils/` if it grows.
- No comments unless logic is non-obvious. No emojis. No new deps without need — prefer existing (`clsx`, `tailwind-merge`, `cva`, `cors`, `dotenv`).

## Verification

- After web changes: `cd web && npm run build` must pass. Fix the error, don't suppress.
- After server changes: `node src/index.js` boots + `curl localhost:5000/api` returns JSON.
- After edits touching `vite.config.js` alias or `jsconfig.json`, confirm `@/` imports still resolve via build.
- Read files before editing. Keep diffs minimal. Don't touch `dist/`, `node_modules/`, `.env`.

## Git

- Branch per task: `feat/<short>`, `fix/<short>`. Commit only when asked. Message: concise imperative (`Add health check`, not `Added...`). Never commit secrets, `.env`, `dist/`, `node_modules/`.
- Before commit/PR: `git status`, `git diff --stat`. Stage only intended files.
