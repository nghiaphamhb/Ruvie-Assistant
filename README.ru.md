# Ruvie Agent

![Ruvie Agent Wallpaper](frontend/src/assets/wallpaper.png)

<p align="center">
  <strong>Минимальное локальное RAG-приложение для Markdown-базы знаний с backend на FastAPI и frontend на React/Vite.</strong>
</p>

## Язык

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Обзор

Ruvie Agent это компактный локальный RAG-проект для Markdown-документов. Backend индексирует Markdown-файлы в Chroma с помощью FastEmbed, находит релевантные чанки и отправляет grounded prompt в OpenRouter-совместимый LLM endpoint. Frontend дает простой chat UI для вопросов, загрузки новых документов и пересборки базы знаний.

## Структура репозитория

- `backend/`: FastAPI API, ingest pipeline, retrieval и интеграция с LLM
- `backend/data/markdown/`: локальная Markdown-база знаний
- `frontend/`: клиент на React 19 + Vite
- `frontend/src/api/ruvieApi.js`: браузерный API client для ask, ingest и upload

## Структура проекта

- `backend/app/main.py`: поднимает FastAPI, CORS, health check и API routes
- `backend/app/api/routes.py`: содержит `POST /ask`, `POST /ingest` и `POST /upload`
- `backend/app/core/config.py`: загружает переменные окружения backend
- `backend/app/services/ingest.py`: читает Markdown, разбивает контент на чанки и сохраняет embedding в Chroma
- `backend/app/services/retriever.py`: выполняет similarity search по локальному vector store
- `backend/app/services/llm.py`: строит RAG prompt и вызывает LLM
- `frontend/src/App.jsx`: основное chat-приложение
- `frontend/src/components/UploadPanel.jsx`: загрузка `.md` и `.txt` файлов с последующим re-index

## Текущие возможности

- Ingest локальных Markdown-файлов
- Векторный поиск через Chroma
- Embedding через FastEmbed
- Генерация ответа с preview источников
- Chat UI на React
- Загрузка документов `.md` и `.txt`
- Ручная пересборка базы знаний из frontend

## Быстрый запуск

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

Backend по умолчанию доступен на `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend по умолчанию доступен на `http://127.0.0.1:5173`.

Backend и frontend нужно запускать в отдельных терминалах.

## Переменные окружения backend

Укажите следующие значения в `backend/.env`:

- `LLM_API_KEY`
- `LLM_MODEL`
- `MARKDOWN_DIR`
- `CHROMA_DIR`
- `CHROMA_COLLECTION`
- `OPENROUTER_BASE_URL`
- `APP_NAME`
- `APP_URL`
- `FRONT_END_URL`

Примеры значений уже есть в `backend/.env-example`.

## Переменные окружения frontend

Укажите в `frontend/.env`:

- `VITE_API_BASE_URL`

Типичное локальное значение:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Базовый сценарий использования

1. Добавить Markdown-файлы в `backend/data/markdown`
2. Запустить backend
3. Запустить frontend
4. Пересобрать базу знаний через `POST /ingest` или кнопку rebuild в интерфейсе
5. Задать вопрос в chat UI
6. При необходимости загрузить дополнительные `.md` или `.txt` файлы

## API Endpoints

- `GET /health`: проверка состояния приложения
- `POST /ask`: ищет релевантные чанки и возвращает `answer` и `sources`
- `POST /ingest`: пересобирает Chroma DB из Markdown-файлов
- `POST /upload`: сохраняет загруженный `.md` или `.txt` файл в `MARKDOWN_DIR` и запускает re-index

Пример запроса `POST /ask`:

```json
{
  "question": "Что такое Ruvie?"
}
```

Пример ответа:

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
