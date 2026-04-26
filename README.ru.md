# Ruvie Agent

![Ruvie Agent Wallpaper](assets/wallpaper.png)

<p align="center">
  <strong>Минимальный Markdown-first RAG backend на FastAPI, LangChain, FastEmbed и Chroma</strong>
</p>

## Язык

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Обзор

Ruvie Agent это ранний backend для RAG по Markdown-документам. Сейчас проект уже умеет загружать Markdown, разбивать текст на чанки, строить эмбеддинги через FastEmbed, сохранять их в Chroma и искать релевантный контекст, а также запускать минимальный FastAPI API.

## Текущее состояние

- `app/services/ingest.py`: читает Markdown из `data/markdown`, разбивает текст, строит эмбеддинги и сохраняет их в `chroma_db`
- `app/services/retriever.py`: выполняет similarity search по Chroma
- `app/main.py`: содержит минимальный endpoint `/health`
- `data/markdown/`: исходная база знаний
- `chroma_db/`: локальная сгенерированная векторная база

## Быстрый запуск

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app/services/ingest.py
uvicorn app.main:app --reload
```

## Дорожная карта

### Phase 1: Завершить RAG core

- Task 1: создать `config.py` для чтения `LLM_API_KEY`, `LLM_MODEL`, `CHROMA_DIR`, `MARKDOWN_DIR` из `.env`
- Task 2: создать `app/services/llm.py` для цепочки `context + question -> LLM -> answer`
- Task 3: добавить строгий RAG prompt, чтобы модель отвечала только по context
- Task 4: создать `test_query.py` для локальной проверки пайплайна до интеграции с FastAPI

### Phase 2: Интеграция с FastAPI

- Task 5: добавить Pydantic-схемы `AskRequest` и `AskResponse`
- Task 6: создать endpoint `POST /ask` для поиска чанков, вызова LLM и возврата answer + sources
- Task 7: создать endpoint `POST /ingest` для повторного вызова `ingest_documents()`
- Task 8: подключить routes в `main.py`

### Phase 3: Очистка и отладка

- Task 9: обработать отсутствие Chroma DB, Markdown-файлов, пустой question, отсутствующий LLM key и отсутствие релевантных чанков
- Task 10: возвращать более понятные sources с `file` и `preview`
- Task 11: дополнить README инструкциями по setup, ingest, server и тесту `/ask`

### Phase 4: После MVP

- Добавить Ollama fallback
- Добавить chat history
- Добавить загрузку файлов
- Добавить frontend
- Добавить streaming response
- Добавить metadata filtering

## Рекомендуемый порядок

1. `config.py`
2. `llm.py`
3. `test_query.py`
4. `POST /ask`
5. `POST /ingest`
6. `README.md`

## Следующая задача

- Создать `config.py` и `.env`
