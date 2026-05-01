# Ruvie Agent

![Ruvie Agent Wallpaper](frontend/src/assets/wallpaper.png)

<p align="center">
  <strong>Minimal local RAG application for Markdown knowledge bases, built with a FastAPI backend and a React/Vite frontend.</strong>
</p>

## Language

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Overview

Ruvie Agent is a lightweight local RAG project for Markdown documents. The backend indexes Markdown files into Chroma with FastEmbed embeddings, retrieves relevant chunks, and sends grounded prompts to an OpenRouter-compatible LLM endpoint. The frontend provides a simple chat interface for asking questions, uploading new documents, and rebuilding the knowledge base.

## Repository Layout

- `backend/`: FastAPI API, ingestion pipeline, retrieval, and LLM integration
- `backend/data/markdown/`: local Markdown knowledge base
- `frontend/`: React 19 + Vite client
- `frontend/src/api/ruvieApi.js`: browser API client for ask, ingest, and upload flows

## Project Structure

- `backend/app/main.py`: bootstraps FastAPI, CORS, health check, and API routes
- `backend/app/api/routes.py`: exposes `POST /ask`, `POST /ingest`, and `POST /upload`
- `backend/app/core/config.py`: loads backend environment variables
- `backend/app/services/ingest.py`: loads Markdown files, splits them into chunks, and persists embeddings to Chroma
- `backend/app/services/retriever.py`: runs similarity search against the local vector store
- `backend/app/services/llm.py`: builds the RAG prompt and calls the LLM
- `frontend/src/App.jsx`: top-level chat application
- `frontend/src/components/UploadPanel.jsx`: uploads `.md` or `.txt` files and triggers re-indexing

## Included Features

- Local Markdown ingestion
- Chroma-backed vector search
- FastEmbed embeddings
- Answer generation with source previews
- React chat UI
- Document upload for `.md` and `.txt`
- Manual knowledge base rebuild from the frontend

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

Backend default URL: `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend default URL: `http://127.0.0.1:5173`

Run backend and frontend in separate terminals.

## Backend Environment Variables

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

## Frontend Environment Variables

Configure `frontend/.env` with:

- `VITE_API_BASE_URL`

Typical local value:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Basic Usage

1. Add Markdown files to `backend/data/markdown`
2. Start the backend
3. Start the frontend
4. Rebuild the knowledge base with `POST /ingest` or the frontend rebuild action
5. Ask a question in the chat UI
6. Upload additional `.md` or `.txt` files when needed

## API Endpoints

- `GET /health`: returns application status
- `POST /ask`: retrieves relevant chunks and returns `answer` plus `sources`
- `POST /ingest`: rebuilds the Chroma database from Markdown files
- `POST /upload`: stores an uploaded `.md` or `.txt` file in `MARKDOWN_DIR` and re-indexes the knowledge base

Example `POST /ask` request:

```json
{
  "question": "What is Ruvie?"
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
