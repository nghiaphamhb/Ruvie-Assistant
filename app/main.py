from fastapi import FastAPI

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