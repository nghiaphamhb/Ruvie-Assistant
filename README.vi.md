# Ruvie Agent

![Ruvie Agent Wallpaper](assets/wallpaper.png)

<p align="center">
  <strong>Ứng dụng RAG cục bộ tối giản cho kho tri thức Markdown, xây bằng FastAPI, Chroma, FastEmbed và client LLM tương thích OpenRouter.</strong>
</p>

## Ngôn ngữ

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Tổng quan

Ruvie Agent là ứng dụng RAG gọn nhẹ cho tài liệu Markdown cục bộ. Ứng dụng đọc các file Markdown, chia thành chunk, lưu embedding vào Chroma, truy xuất ngữ cảnh liên quan và sinh câu trả lời kèm nguồn tham chiếu qua cả web UI lẫn JSON API.

## Ảnh minh họa

![Ruvie App Example](assets/example.png)

## Cấu trúc dự án

- `app/main.py`: khởi tạo FastAPI, mount static files, phục vụ UI tại `/` và nạp API routes
- `app/api/routes.py`: cung cấp `POST /ask` và `POST /ingest`
- `app/core/config.py`: đọc biến môi trường từ `.env`
- `app/core/logging_config.py`: cấu hình logging cho ứng dụng
- `app/services/ingest.py`: đọc Markdown, chia chunk và lưu embedding vào Chroma
- `app/services/retriever.py`: tìm kiếm tương tự trên vector store cục bộ
- `app/services/llm.py`: dựng prompt RAG và gọi LLM qua OpenAI SDK với base URL tương thích OpenRouter
- `app/static/index.html`: giao diện web đơn giản để hỏi đáp và xem nguồn
- `data/markdown/`: kho tài liệu Markdown cục bộ
- `chroma_db/`: cơ sở dữ liệu vector sinh ra sau khi ingest

## Tính năng hiện có

- Ingest tài liệu Markdown cục bộ
- Tìm kiếm vector bằng Chroma
- Tạo embedding với FastEmbed
- Sinh câu trả lời kèm source preview
- Giao diện web tại `GET /`
- API cho luồng hỏi đáp và ingest

## Chạy nhanh

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

Sau khi server chạy, mở `http://localhost:8000`.

## Biến môi trường

Khai báo các giá trị sau trong `.env`:

- `LLM_API_KEY`
- `LLM_MODEL`
- `MARKDOWN_DIR`
- `CHROMA_DIR`
- `CHROMA_COLLECTION`
- `OPENROUTER_BASE_URL`
- `APP_NAME`
- `APP_URL`

## Cách dùng cơ bản

1. Thêm file Markdown vào `data/markdown`
2. Khởi động server
3. Mở giao diện web tại `http://localhost:8000`
4. Nếu vector store chưa có dữ liệu, gọi `POST /ingest`
5. Đặt câu hỏi và xem `answer` cùng `sources`

## API Endpoints

- `GET /`: trả về web UI
- `GET /health`: kiểm tra trạng thái ứng dụng
- `POST /ask`: truy xuất chunk liên quan và trả về `answer` cùng `sources`
- `POST /ingest`: build lại Chroma DB từ file Markdown

Ví dụ request `POST /ask`:

```json
{
  "question": "Ruvie là gì?"
}
```

Ví dụ response:

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
