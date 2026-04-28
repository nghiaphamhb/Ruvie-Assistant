from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.api.routes import router
from app.core.logging_config import setup_logging

setup_logging()

app = FastAPI(
    title="Ruvie API",
    description="Minimal RAG backend for Markdown files",
    version="0.1.0",
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "project": "Ruvie"
    }

app.include_router(router)

app.mount("/static", StaticFiles(directory="app/static"))

@app.get("/")
def serve_ui():
    return FileResponse("app/static/index.html")