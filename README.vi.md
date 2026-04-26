# Ruvie Agent

![Ruvie Agent Wallpaper](assets/wallpaper.png)

<p align="center">
  <strong>Backend RAG tối giản cho tài liệu Markdown, xây bằng FastAPI, LangChain, FastEmbed và Chroma</strong>
</p>

## Ngôn ngữ

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Tổng quan

Ruvie Agent là backend RAG giai đoạn đầu, tập trung vào tài liệu Markdown. Dự án hiện có khả năng nạp tài liệu, chia chunk, tạo embedding bằng FastEmbed, lưu vector vào Chroma, truy xuất ngữ cảnh liên quan và chạy FastAPI với endpoint kiểm tra trạng thái.

## Trạng thái hiện tại

- `app/services/ingest.py`: đọc Markdown từ `data/markdown`, chia nhỏ nội dung, tạo embedding và lưu vào `chroma_db`
- `app/services/retriever.py`: tìm kiếm các đoạn liên quan bằng similarity search
- `app/main.py`: hiện có endpoint `/health`
- `data/markdown/`: nơi đặt tài liệu nguồn
- `chroma_db/`: cơ sở dữ liệu vector sinh ra cục bộ

## Chạy nhanh

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app/services/ingest.py
uvicorn app.main:app --reload
```

## Lộ trình

### Phase 1: Hoàn thiện RAG core

- Task 1: tạo `config.py` để đọc `LLM_API_KEY`, `LLM_MODEL`, `CHROMA_DIR`, `MARKDOWN_DIR` từ `.env`
- Task 2: tạo `app/services/llm.py` cho luồng `context + question -> LLM -> answer`
- Task 3: viết prompt RAG ép model chỉ trả lời theo context
- Task 4: tạo `test_query.py` để test pipeline trước khi đưa vào FastAPI

### Phase 2: Đưa vào FastAPI

- Task 5: tạo schema Pydantic `AskRequest` và `AskResponse`
- Task 6: tạo endpoint `POST /ask` để search chunk, gọi LLM, trả answer và sources
- Task 7: tạo endpoint `POST /ingest` để gọi lại `ingest_documents()`
- Task 8: gắn routes vào `main.py`

### Phase 3: Dọn code và debug

- Task 9: xử lý lỗi thiếu Chroma DB, thiếu file Markdown, question rỗng, thiếu LLM key, không có chunk phù hợp
- Task 10: trả sources rõ hơn với `file` và `preview`
- Task 11: hoàn thiện README cho setup, ingest, server và test `/ask`

### Phase 4: Sau MVP

- Thêm Ollama fallback
- Thêm chat history
- Thêm upload file
- Thêm frontend
- Thêm streaming response
- Thêm metadata filtering

## Thứ tự nên làm ngay

1. `config.py`
2. `llm.py`
3. `test_query.py`
4. `POST /ask`
5. `POST /ingest`
6. `README.md`

## Task tiếp theo

- Tạo `config.py` và `.env`
