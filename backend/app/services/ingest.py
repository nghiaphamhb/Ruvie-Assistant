import shutil
from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_chroma import Chroma

from app.core.config import settings


MARKDOWN_DIR = settings.MARKDOWN_DIR
CHROMA_DIR = settings.CHROMA_DIR

COLLECTION_NAME = settings.CHROMA_COLLECTION

def load_markdown_documents():
    loader = DirectoryLoader(
        path=str(MARKDOWN_DIR),
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={
            "encoding": "utf-8",
        },
        show_progress=True,
    )

    document = loader.load()
    return document

def split_documents(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=100,
    )

    chunks = splitter.split_documents(documents)
    return chunks

def reset_chroma_db():
    if CHROMA_DIR.exists():
        shutil.rmtree(CHROMA_DIR)

def ingest_documents():
    print("Loading Markdown documents...")
    documents = load_markdown_documents()

    print(f"Loaded documents: {len(documents)}")

    if not documents:
        print("No Markdown documents found.")
        return

    print("Splitting documents into chunks...")
    chunks = split_documents(documents)

    print(f"Created chunks: {len(chunks)}")

    print("Resetting Chroma database...")
    reset_chroma_db()

    print("Creating embeddings and saving to Chroma...")
    embeddings = FastEmbedEmbeddings()

    Chroma.from_documents(
        collection_name=COLLECTION_NAME,
        persist_directory=str(CHROMA_DIR),
        documents=chunks,
        embedding=embeddings,
    )

    print("Ingestion completed.")
    print(f"Chroma DB saved at: {CHROMA_DIR}")


# if __name__ == "__main__":
#     ingest_documents()