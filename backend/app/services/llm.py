from openai import OpenAI

from app.core.config import settings

def get_llm_client() -> OpenAI:
    if not settings.LLM_API_KEY:
        raise ValueError("LLM_API_KEY is missing. Please set it in .env")

    client = OpenAI(
        base_url=settings.OPENROUTER_BASE_URL,
        api_key=settings.LLM_API_KEY,
        default_headers={
            "HTTP-Referer": settings.APP_URL,
            "X-OpenRouter-Title": settings.APP_NAME,
        },
    )

    return client


def build_rag_prompt(context: str, question: str) -> list[dict]:
    return [
        {
            "role": "system",
            "content": (
                "You are Ruvie, a helpful RAG assistant. "
                "Answer only using the provided context. "
                "If the context does not contain the answer, say that the information was not found in the documents. "
                "Keep the answer concise and clear."
            ),
        },
        {
            "role": "user",
            "content": f"""
Context:
{context}

Question:
{question}
""",
        },
    ]


def generate_answer(context: str, question: str) -> str:
    client = get_llm_client()

    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=build_rag_prompt(context, question),
        temperature=0.2,
    )

    return response.choices[0].message.content