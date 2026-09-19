# chaicodeLLM — Production-Grade RAG Application

Goal: build a production-grade Retrieval-Augmented Generation (RAG) application following an advanced RAG pipeline — not a basic demo. The backend owns ingestion, indexing, retrieval, and generation. The frontend is only a thin consumer of the API.

## Application Goals

1. **Multi-source ingestion:** allow users to add multiple data sources — PDF, plain text, audio, video, VTT, and TTML/TTXT subtitle/transcript files.
2. **Production ingestion pipeline:** parse → normalize → clean → chunk → embed → index, with per-source metadata (source type, filename, timestamps where applicable).
3. **Advanced retrieval:** chunking strategies, hybrid search (vector + keyword), reranking, filtered search by source, and grounded answers with citations.
4. **Audio/video support:** transcribe audio/video (and parse VTT/TT transcript files) so spoken content becomes searchable chunks with time-range references.
5. **API-first backend:** all RAG logic lives in `server/` and is exposed as versioned REST endpoints (`/api/...`). `web/` only calls the API — no business logic in the frontend.

## Planned Advanced RAG Pipeline

```
ingest (pdf/txt/audio/video/vtt/ttt)
  → parse + transcribe
  → clean + normalize
  → chunk (recursive / semantic, with overlap)
  → embed
  → vector store + metadata index
  → query rewrite
  → hybrid retrieval (vector + BM25/keyword)
  → rerank
  → context assembly + citation mapping
  → LLM generation (grounded, with sources)
```

Non-goals for v1: auth/multi-tenancy, eval harness, streaming UI polish — these come after the core pipeline works end-to-end.

## Monorepo

- `web/` — React + Vite + Tailwind v4 + shadcn. Thin UI, calls API via `VITE_API_URL`.
- `server/` — Express API (ESM). Owns the RAG pipeline: routes in `src/routes/`, business logic in `src/services/` / `src/utils/` as it grows.

## Quick Start

```bash
cd server && npm install && npm run dev   # http://localhost:5000 (/api, /api/health)
cd web && npm install && npm run dev      # http://localhost:5173
```

Env: `server/.env` → `PORT=5000`. `web/.env` → `VITE_API_URL=http://localhost:5000`. See each `.env.example`. Never commit `.env`.

## Current Status

- [x] Monorepo scaffold (`web/` + `server/`), health checks
- [ ] File ingestion (pdf, text, vtt, ttt)
- [ ] Audio/video transcription pipeline
- [ ] Chunking + embeddings + vector store
- [ ] Hybrid retrieval + reranking
- [ ] Grounded Q&A endpoint with citations

See `AGENTS.md` for agent workflow (backend-only unless UI is explicitly requested) and `SKILL.md` for the fullstack scaffold skill.
