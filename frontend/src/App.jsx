import { useMemo, useState } from "react";
import { askRuvie, ingestDocuments } from "./api/ruvieApi";
import AppShell from "./components/layout/AppShell";
import "./index.css";

function createNewChat() {
  const id = crypto.randomUUID();

  return {
    id,
    title: "New chat",
    messages: [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Hello, I'm Ruvie. Ask me about your documents.",
        sources: [],
      },
    ],
  };
}

function App() {
  const firstChat = useMemo(() => createNewChat(), []);

  const [chats, setChats] = useState([firstChat]);
  const [activeChatId, setActiveChatId] = useState(firstChat.id);
  const [loading, setLoading] = useState(false);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  function updateActiveChat(updater) {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== activeChatId) return chat;
        return updater(chat);
      })
    );
  }

  function handleNewChat() {
    const newChat = createNewChat();

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  async function handleAsk(question) {
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      sources: [],
    };

    updateActiveChat((chat) => ({
      ...chat,
      title: chat.title === "New chat" ? question.slice(0, 32) : chat.title,
      messages: [...chat.messages, userMessage],
    }));

    setLoading(true);

    try {
      const data = await askRuvie(question);

      const assistantMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        sources: data.sources || [],
      };

      updateActiveChat((chat) => ({
        ...chat,
        messages: [...chat.messages, assistantMessage],
      }));
    } catch (error) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Lỗi: ${error.message}`,
            sources: [],
          },
        ],
      }));
    } finally {
      setLoading(false);
    }
  }

  async function handleIngest() {
    setLoading(true);

    try {
      await ingestDocuments();

      updateActiveChat((chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Đã rebuild knowledge base thành công.",
            sources: [],
          },
        ],
      }));
    } catch (error) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Ingest failed: ${error.message}`,
            sources: [],
          },
        ],
      }));
    } finally {
      setLoading(false);
    }
  }

  function handleUploaded(message) {
    updateActiveChat((chat) => ({
      ...chat,
      messages: [
        ...chat.messages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: message,
          sources: [],
        },
      ],
    }));
  }

  return (
    <AppShell
      chats={chats}
      activeChatId={activeChatId}
      activeChat={activeChat}
      loading={loading}
      onNewChat={handleNewChat}
      onSelectChat={setActiveChatId}
      onAsk={handleAsk}
      onIngest={handleIngest}
      onUploaded={handleUploaded}
    />
  );
}

export default App;
