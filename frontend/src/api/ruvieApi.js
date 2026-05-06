const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function askRuvie(question) {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.detail || "Failed to ask Ruvie");
  }

  return payload.data;
}

export async function ingestDocuments() {
  const response = await fetch(`${API_BASE_URL}/ingest`, {
    method: "POST",
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.detail || "Failed to ingest documents");
  }

  return payload;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.detail || "Failed to upload document");
  }

  return payload;
}
