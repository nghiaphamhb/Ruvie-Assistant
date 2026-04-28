# Ruvie Agent

![Ruvie Agent Wallpaper](assets/wallpaper.png)

<p align="center">
  <strong>Минимальное локальное RAG-приложение для Markdown-базы знаний на FastAPI, Chroma, FastEmbed и OpenRouter-совместимом LLM-клиенте.</strong>
</p>

## Язык

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Обзор

Ruvie Agent это компактное локальное RAG-приложение для Markdown-документов. Оно читает Markdown-файлы, разбивает их на чанки, сохраняет embedding в Chroma, ищет релевантный контекст и генерирует ответы с превью источников через web UI и JSON API.

## Пример интерфейса

![Ruvie App Example](assets/example.png)

## Структура проекта

- `app/main.py`: поднимает FastAPI, монтирует static files, отдает UI по `/` и подключает API routes
- `app/api/routes.py`: содержит `POST /ask` и `POST /ingest`
- `app/core/config.py`: загружает переменные окружения из `.env`
- `app/core/logging_config.py`: настраивает logging приложения
- `app/services/ingest.py`: читает Markdown, разбивает контент на чанки и сохраняет embedding в Chroma
- `app/services/retriever.py`: выполняет similarity search по локальному vector store
- `app/services/llm.py`: строит RAG prompt и вызывает LLM через OpenAI SDK с OpenRouter-совместимым base URL
- `app/static/index.html`: простой web UI для вопросов, ответов и источников
- `data/markdown/`: локальная Markdown-база знаний
- `chroma_db/`: локальная векторная база после ingest

## Текущие возможности

- Ingest локальных Markdown-файлов
- Векторный поиск через Chroma
- Embedding через FastEmbed
- Генерация ответа с preview источников
- Простой UI на `GET /`
- API для ask и ingest сценариев

## Быстрый запуск

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

После запуска сервера откройте `http://localhost:8000`.

## Переменные окружения

Укажите следующие значения в `.env`:

- `LLM_API_KEY`
- `LLM_MODEL`
- `MARKDOWN_DIR`
- `CHROMA_DIR`
- `CHROMA_COLLECTION`
- `OPENROUTER_BASE_URL`
- `APP_NAME`
- `APP_URL`

## Базовый сценарий использования

1. Добавить Markdown-файлы в `data/markdown`
2. Запустить сервер
3. Открыть UI по адресу `http://localhost:8000`
4. Если vector store еще не собран, вызвать `POST /ingest`
5. Задать вопрос и посмотреть `answer` и `sources`

## API Endpoints

- `GET /`: отдает web UI
- `GET /health`: проверка состояния приложения
- `POST /ask`: ищет релевантные чанки и возвращает `answer` и `sources`
- `POST /ingest`: пересобирает Chroma DB из Markdown-файлов

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
