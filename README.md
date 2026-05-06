# Ruvie Agent

![Ruvie Agent Wallpaper](frontend/src/assets/wallpaper.png)

<p align="center">
  <strong>Minimal local RAG application for Markdown knowledge bases, built with a FastAPI backend and a React/Vite frontend.</strong>
</p>

## Overview

Ruvie Agent is a lightweight local retrieval-augmented generation project for Markdown documents.
It is designed for simple, local-first knowledge workflows:

- index Markdown files into a local vector database
- retrieve relevant chunks for each question
- generate grounded answers through an OpenRouter-compatible LLM endpoint
- manage ingestion and uploads from a React chat interface

The repository is split into two main parts:

- `backend/`: FastAPI API, ingestion pipeline, retrieval, and LLM integration
- `frontend/`: React 19 + Vite client

## Features

- Local Markdown ingestion
- Chroma-backed vector search
- FastEmbed embeddings
- Grounded answer generation with source previews
- React chat UI with assistant/user message rendering
- Upload support for `.md` and `.txt` files
- Manual knowledge base rebuild from the frontend

## Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn
- ChromaDB
- FastEmbed
- LangChain integrations
- OpenAI SDK with OpenRouter-compatible base URL

### Frontend

- React 19
- Vite
- JavaScript + JSX
- CSS
- `lucide-react`
- ESLint
- Prettier
- Husky + lint-staged

## Repository Layout

```text
backend/
  app/
    api/
    core/
    services/
    main.py
  data/markdown/
  chroma_db/
  requirements.txt

frontend/
  .husky/
  src/
    api/
    assets/
    components/
      chat/
      documents/
      layout/
    App.jsx
    index.css
    main.jsx
  package.json
  eslint.config.js
  vite.config.js
```

## Quick Start

Run backend and frontend in separate terminals.

### 1. Start the Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

Backend default URL: `http://127.0.0.1:8000`

### 2. Start the Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend default URL: `http://127.0.0.1:5173`

## Environment Variables

### Backend

Configure `backend/.env` with:

- `LLM_API_KEY`
- `LLM_MODEL`
- `MARKDOWN_DIR`
- `CHROMA_DIR`
- `CHROMA_COLLECTION`
- `OPENROUTER_BASE_URL`
- `APP_NAME`
- `APP_URL`
- `FRONT_END_URL`

Example values are already provided in `backend/.env-example`.

### Frontend

Configure `frontend/.env` with:

- `VITE_API_BASE_URL`

Typical local value:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Basic Usage

1. Add Markdown files to `backend/data/markdown`.
2. Start the backend.
3. Start the frontend.
4. Rebuild the knowledge base using `POST /ingest` or the rebuild action in the UI.
5. Ask a question in the chat interface.
6. Upload additional `.md` or `.txt` files when needed.

## API Endpoints

- `GET /health`: returns application status
- `POST /ask`: retrieves relevant chunks and returns `answer` plus `sources`
- `POST /ingest`: rebuilds the Chroma database from Markdown files
- `POST /upload`: stores an uploaded `.md` or `.txt` file in `MARKDOWN_DIR` and re-indexes the knowledge base

Example `POST /ask` request:

```json
{
  "question": "What is Ruvie Agent?"
}
```

Example response shape:

```json
{
  "status": "success",
  "message": "Answer generated successfully.",
  "data": {
    "answer": "...",
    "sources": [
      {
        "file": "data/markdown/intro.md",
        "preview": "..."
      }
    ]
  }
}
```

## Frontend Quality Checks

From `frontend/`:

```bash
npm run lint
npm run format
npm run build
```

Pre-commit checks are wired through Husky and lint-staged.
