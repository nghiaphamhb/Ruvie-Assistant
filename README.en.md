# Ruvie Agent

![Ruvie Agent Wallpaper](assets/wallpaper.png)

<p align="center">
  <strong>Minimal Markdown-first RAG backend built with FastAPI, LangChain, FastEmbed, and Chroma</strong>
</p>

## Language

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Overview

Ruvie Agent is an early-stage RAG backend that ingests Markdown documents, splits them into chunks, stores embeddings in Chroma, and retrieves relevant context for user questions. The current codebase already includes document ingestion, vector search, and a basic FastAPI health endpoint.

## Current Project State

- `app/services/ingest.py`: loads Markdown from `data/markdown`, chunks content, embeds with `FastEmbedEmbeddings`, and writes to `chroma_db`
- `app/services/retriever.py`: performs similarity search on the Chroma collection
- `app/main.py`: exposes a minimal `/health` endpoint
- `data/markdown/`: source knowledge base in Markdown
- `chroma_db/`: generated local vector database

## Quick Start

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app/services/ingest.py
uvicorn app.main:app --reload
```

## Roadmap

### Phase 1: Finish the RAG core

- Task 1: create `config.py` to load `LLM_API_KEY`, `LLM_MODEL`, `CHROMA_DIR`, `MARKDOWN_DIR` from `.env`
- Task 2: create `app/services/llm.py` for `context + question -> LLM -> answer`
- Task 3: add a strict RAG prompt so answers only use provided context
- Task 4: create `test_query.py` to test retrieval and answer generation before FastAPI integration

### Phase 2: Add FastAPI endpoints

- Task 5: add `AskRequest` and `AskResponse` Pydantic schemas
- Task 6: add `POST /ask` to retrieve chunks, call the LLM, and return answer plus sources
- Task 7: add `POST /ingest` to re-run `ingest_documents()`
- Task 8: register API routes in `main.py`

### Phase 3: Cleanup and debugging

- Task 9: handle missing Chroma DB, missing Markdown files, empty question, missing LLM key, and no relevant chunks
- Task 10: return clearer source objects with `file` and `preview`
- Task 11: expand README with setup, ingest, server, and `/ask` usage

### Phase 4: After MVP

- Add Ollama fallback
- Add chat history
- Add file upload
- Add frontend
- Add streaming responses
- Add metadata filtering

## Recommended Next Order

1. `config.py`
2. `llm.py`
3. `test_query.py`
4. `POST /ask`
5. `POST /ingest`
6. `README.md`

## Immediate Next Task

- Create `config.py` and `.env`
