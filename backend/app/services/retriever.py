from langchain_community.embeddings import FastEmbedEmbeddings
from langchain_chroma import Chroma

from app.core.config import settings

CHROMA_DIR = settings.CHROMA_DIR
COLLECTION_NAME = settings.CHROMA_COLLECTION

def get_vector_store():
    embeddings = FastEmbedEmbeddings()

    vector_store = Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=str(CHROMA_DIR),
        embedding_function=embeddings,
    )

    return vector_store

def search_documents(query: str, k: int = 3):
    vector_store = get_vector_store()

    results = vector_store.similarity_search_with_score(
        query=query,
        k=k,
    )

    return results

if __name__ == "__main__":
    query = "Mục tiêu phiên bản đầu là gì?"

    results = search_documents(query)

    print(f"Query: {query}")
    print(f"Found results: {len(results)}")

    for index, (doc, score) in enumerate(results, start=1):
        print(f"\n--- Result {index} ---")
        print(f"Score: {score}")
        print(f"Source: {doc.metadata.get('source')}")
        print(doc.page_content[:500])