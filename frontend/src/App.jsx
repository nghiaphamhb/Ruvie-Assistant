import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import { useState } from "react";
import { askRuvie, ingestDocuments } from "./api/ruvieApi";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Xin chào, tôi là Ruvie. Hãy hỏi tôi về tài liệu của bạn.",
      sources: [],
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function handleAsk(question) {
    const userMessage = {
      role: "user",
      content: question,
      sources: [],
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await askRuvie(question);

      const assistantMessage = {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch(error) {
      setMessages((prev) => 
      [...prev,
        {
          role: "assistant",
          content: `Ask failed: ${error.message}`,
          sources: [],
        }
      ]
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleIngest() {
    setLoading(true);

    try {
      await ingestDocuments();
      setMessages((prev) => [...prev, 
        {
          role: "assistant",
          content: "Rebuild knowledge base successfully.",
          sources: [],
        }
      ]);
    } catch(error) {
      setMessages((prev) => 
      [...prev,
        {
          role: "assistant",
          content: `Ingest failed: ${error.message}`,
          sources: [],
        }
      ]
      );
    } finally {
      setLoading(false);
    }
  }

  function handleUploaded(message) {
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: message,
        sources: [],
      },
    ]);
  }

  return (
    <div className="app-shell">
      <Sidebar onIngest={handleIngest} onUploaded={handleUploaded}/>

      <main className="chat-page">
        <div className="bg-overlay" />

        <div className="chat-container">
          <header className="chat-header">
            <div>
              <h1>Ruvie</h1>
              <p>Internal Knowledge Assistant</p>
            </div>
          </header>

          <ChatWindow messages={messages} loading={loading}/>
          <ChatInput onSend={handleAsk} disabled={loading}/>
        </div>
      </main>
    </div>
  );
}