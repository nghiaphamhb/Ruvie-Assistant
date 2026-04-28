from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.retriever import search_documents
from app.services.llm import generate_answer
from app.services.ingest import ingest_documents

import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class AskRequest(BaseModel):
    question: str

class Source(BaseModel):
    file: str
    preview: str

class AskData(BaseModel):
    answer: str
    sources: list[Source]

class AskResponse(BaseModel):
    status: str
    message: str
    data: AskData

class IngestData(BaseModel):
    documents_indexed: int | None = None


class IngestResponse(BaseModel):
    status: str
    message: str
    data: IngestData | None = None

def build_context(results) -> str:
    context_parts = []

    for doc, score in results:
        source = doc.metadata.get("source", "unknown")
        content = doc.page_content

        context_parts.append(
            f"Source: {source}\nContent:\n{content}"
        )

    return "\n\n---\n\n".join(context_parts)

@router.post("/ask", response_model=AskResponse)
def ask(request: AskRequest):
    question = request.question.strip()
    logger.info("Received question: %s", question)

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )
    
    try:
        results = search_documents(question, k=3)
        logger.info("Retrieved %s chunks", len(results))

        if not results:
            raise HTTPException(
                status_code=404,
                detail="No relevant documents found.",
            )

        context = build_context(results)
        answer = generate_answer(context=context, question=question)

        sources = []

        for doc, score in results:
            sources.append(
                Source(
                    file=doc.metadata.get("source", "unknown"),
                    preview=doc.page_content[:200],
                )
            )

        return AskResponse(
            status="success",
            message="Answer generated successfully.",
            data=AskData(
                answer=answer,
                sources=sources,
            ),
        )
    
    except HTTPException:
        raise 

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ask failed: {str(e)}",
        )

@router.post("/ingest", response_model=IngestResponse)
def ingest():
    try:
        logger.info("Starting ingestion")
        ingest_documents()

        logger.info("Ingestion completed successfully")

        return IngestResponse(
            status="success",
            message="Documents ingested successfully.",
            data=None,
        )

    except Exception as e:
        logger.exception("Ingestion failed")

        raise HTTPException(
            status_code=500,
            detail=f"Ingestion failed: {str(e)}",
        )