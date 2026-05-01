# Ruvie Agent

![Ruvie Agent Wallpaper](frontend/src/assets/wallpaper.png)

Minimal local RAG application for Markdown knowledge bases. The current repository is split into a FastAPI backend and a React/Vite frontend.

## Languages

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Current Stack

- Backend: FastAPI, Chroma, FastEmbed, OpenAI SDK with OpenRouter-compatible base URL
- Frontend: React 19, Vite
- Knowledge source: local `.md` files in `backend/data/markdown`

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open the frontend URL shown by Vite, typically `http://127.0.0.1:5173`.

## API Summary

- `GET /health`
- `POST /ask`
- `POST /ingest`
- `POST /upload`

For full setup and usage details, see the language-specific README above.
