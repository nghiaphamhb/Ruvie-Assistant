# Ruvie Agent

![Ruvie Agent Wallpaper](assets/wallpaper.png)

<p align="center">
  <strong>Minimal local RAG app for Markdown knowledge bases, built with FastAPI, Chroma, FastEmbed, and an OpenRouter-compatible LLM client.</strong>
</p>

## Language

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Overview

Ruvie Agent is a lightweight RAG application for local Markdown knowledge bases. It ingests Markdown files, splits them into chunks, stores embeddings in Chroma, retrieves relevant context, and generates answers with source previews through both a web UI and a JSON API.

## App Preview

![Ruvie App Example](assets/example.png)

## Project Structure

- `app/main.py`: bootstraps FastAPI, mounts static files, serves the UI at `/`, and includes API routes
- `app/api/routes.py`: exposes `POST /ask` and `POST /ingest`
- `app/core/config.py`: loads environment variables from `.env`
- `app/core/logging_config.py`: configures application logging
- `app/services/ingest.py`: loads Markdown files, splits them into chunks, and persists embeddings to Chroma
- `app/services/retriever.py`: performs similarity search against the local vector store
- `app/services/llm.py`: builds the RAG prompt and generates answers through the OpenAI SDK with an OpenRouter-compatible base URL
- `app/static/index.html`: simple browser UI for asking questions and viewing answers with sources
- `data/markdown/`: local Markdown knowledge base
- `chroma_db/`: generated local vector database

## Included Features

- Local Markdown ingestion
- Chroma-backed vector search
- FastEmbed embeddings
- Answer generation with source previews
- Simple UI at `GET /`
- API endpoints for ask and ingest workflows

## Quick Start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

After the server starts, open `http://localhost:8000`.

## Environment Variables

Configure `.env` with:

- `LLM_API_KEY`
- `LLM_MODEL`
- `MARKDOWN_DIR`
- `CHROMA_DIR`
- `CHROMA_COLLECTION`
- `OPENROUTER_BASE_URL`
- `APP_NAME`
- `APP_URL`

## Basic Usage

1. Add Markdown files to `data/markdown`
2. Start the server
3. Open the browser UI at `http://localhost:8000`
4. If the vector store is not built yet, call `POST /ingest`
5. Ask a question and inspect the returned answer and sources

## API Endpoints

- `GET /`: serves the web UI
- `GET /health`: returns application status
- `POST /ask`: retrieves relevant chunks and returns `answer` plus `sources`
- `POST /ingest`: rebuilds the Chroma database from Markdown files

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
