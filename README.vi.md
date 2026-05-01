# Ruvie Agent

![Ruvie Agent Wallpaper](frontend/src/assets/wallpaper.png)

<p align="center">
  <strong>Ứng dụng RAG cục bộ tối giản cho kho tri thức Markdown, gồm backend FastAPI và frontend React/Vite.</strong>
</p>

## Ngôn ngữ

- [English](README.en.md)
- [Tiếng Việt](README.vi.md)
- [Русский](README.ru.md)

## Tổng quan

Ruvie Agent là dự án RAG gọn nhẹ cho tài liệu Markdown cục bộ. Backend đọc các file Markdown, chia chunk, lưu embedding vào Chroma bằng FastEmbed, truy xuất ngữ cảnh liên quan rồi gửi prompt có grounding tới endpoint LLM tương thích OpenRouter. Frontend cung cấp giao diện chat để hỏi đáp, upload tài liệu mới và rebuild knowledge base.

## Bố cục repository

- `backend/`: API FastAPI, pipeline ingest, retrieval và tích hợp LLM
- `backend/data/markdown/`: kho tài liệu Markdown cục bộ
- `frontend/`: client React 19 + Vite
- `frontend/src/api/ruvieApi.js`: API client cho ask, ingest và upload

## Cấu trúc dự án

- `backend/app/main.py`: khởi tạo FastAPI, CORS, health check và API routes
- `backend/app/api/routes.py`: cung cấp `POST /ask`, `POST /ingest` và `POST /upload`
- `backend/app/core/config.py`: đọc biến môi trường của backend
- `backend/app/services/ingest.py`: đọc Markdown, chia chunk và lưu embedding vào Chroma
- `backend/app/services/retriever.py`: tìm kiếm tương tự trên vector store cục bộ
- `backend/app/services/llm.py`: dựng prompt RAG và gọi LLM
- `frontend/src/App.jsx`: ứng dụng chat chính
- `frontend/src/components/UploadPanel.jsx`: upload file `.md` hoặc `.txt` và kích hoạt re-index

## Tính năng hiện có

- Ingest tài liệu Markdown cục bộ
- Tìm kiếm vector bằng Chroma
- Tạo embedding với FastEmbed
- Sinh câu trả lời kèm source preview
- Giao diện chat bằng React
- Upload tài liệu `.md` và `.txt`
- Rebuild knowledge base thủ công từ frontend

## Chạy nhanh

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env-example .env
uvicorn app.main:app --reload
```

Backend mặc định chạy tại `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend mặc định chạy tại `http://127.0.0.1:5173`.

Chạy backend và frontend ở hai terminal riêng.

## Biến môi trường backend

Khai báo các giá trị sau trong `backend/.env`:

- `LLM_API_KEY`
- `LLM_MODEL`
- `MARKDOWN_DIR`
- `CHROMA_DIR`
- `CHROMA_COLLECTION`
- `OPENROUTER_BASE_URL`
- `APP_NAME`
- `APP_URL`
- `FRONT_END_URL`

Các giá trị mẫu đã có trong `backend/.env-example`.

## Biến môi trường frontend

Khai báo trong `frontend/.env`:

- `VITE_API_BASE_URL`

Giá trị local điển hình:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Cách dùng cơ bản

1. Thêm file Markdown vào `backend/data/markdown`
2. Khởi động backend
3. Khởi động frontend
4. Rebuild knowledge base bằng `POST /ingest` hoặc nút rebuild trên giao diện
5. Đặt câu hỏi trong chat UI
6. Upload thêm file `.md` hoặc `.txt` khi cần

## API Endpoints

- `GET /health`: kiểm tra trạng thái ứng dụng
- `POST /ask`: truy xuất chunk liên quan và trả về `answer` cùng `sources`
- `POST /ingest`: build lại Chroma DB từ file Markdown
- `POST /upload`: lưu file `.md` hoặc `.txt` vào `MARKDOWN_DIR` rồi re-index knowledge base

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
