# Ruvie Project Documentation

## 1. Giới thiệu

Ruvie là một hệ thống backend RAG (Retrieval-Augmented Generation) được thiết kế để hỗ trợ tìm kiếm và trả lời câu hỏi dựa trên tài liệu nội bộ dạng Markdown.

Mục tiêu của dự án là xây dựng một nền tảng đơn giản nhưng có thể mở rộng, cho phép người dùng truy vấn thông tin nhanh chóng mà không cần đọc toàn bộ tài liệu.

Ruvie lấy cảm hứng từ các công cụ như Perplexity và Obsidian, kết hợp giữa khả năng tìm kiếm tài liệu và sức mạnh của mô hình ngôn ngữ lớn (LLM).

---

## 2. Kiến trúc tổng thể

Hệ thống bao gồm các thành phần chính:

### 2.1 Data Layer

- Tài liệu đầu vào: file `.md`
- Lưu trữ cục bộ trong thư mục `data/markdown`
- Nội dung có thể bao gồm:
  - Documentation kỹ thuật
  - Ghi chú nội bộ
  - Hướng dẫn vận hành

### 2.2 Ingestion Pipeline

Pipeline xử lý dữ liệu gồm các bước:

1. Đọc file Markdown
2. Chia nhỏ nội dung (chunking)
3. Tạo embedding vector
4. Lưu vào vector database (Chroma)

### 2.3 Vector Database

- Sử dụng ChromaDB
- Lưu embedding của từng chunk
- Cho phép truy vấn theo ngữ nghĩa (semantic search)

### 2.4 Retrieval Layer

- Nhận câu hỏi từ user
- Tìm các chunk liên quan nhất (top-k)
- Trả về context cho LLM

### 2.5 LLM Layer

- Sử dụng API token (OpenRouter/OpenAI-compatible)
- Nhận context + question
- Sinh câu trả lời

### 2.6 API Layer

- Sử dụng FastAPI
- Các endpoint chính:
  - `/health`
  - `/ingest`
  - `/ask`

---

## 3. Luồng hoạt động

### 3.1 Ingestion

```text
Markdown files
→ Loader
→ Text Splitter
→ Embeddings
→ Chroma DB