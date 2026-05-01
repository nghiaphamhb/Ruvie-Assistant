import os
from pathlib import Path 
from dotenv import load_dotenv

load_dotenv()

class Settings:
    LLM_API_KEY = os.getenv("LLM_API_KEY")
    LLM_MODEL = os.getenv("LLM_MODEL")

    MARKDOWN_DIR = Path(os.getenv("MARKDOWN_DIR"))
    CHROMA_DIR = Path(os.getenv("CHROMA_DIR"))
    CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION")

    OPENROUTER_BASE_URL: str = os.getenv("OPENROUTER_BASE_URL")

    APP_NAME: str = os.getenv("APP_NAME")
    APP_URL: str = os.getenv("APP_URL")

    FRONT_END_URL: str = os.getenv("FRONT_END_URL")

settings = Settings()
