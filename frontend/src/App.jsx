import { useEffect, useMemo, useState } from "react";
import { askRuvie, ingestDocuments } from "./api/ruvieApi";
import AppShell from "./components/layout/AppShell";
import "./index.css";

const CHAT_STORAGE_KEY = "ruvie.chats";
const ACTIVE_CHAT_STORAGE_KEY = "ruvie.activeChatId";

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

function createAssistantMessage(content, sources = [], id = crypto.randomUUID()) {
  return {
    id,
    role: "assistant",
    content,
    sources,
  };
}

function createAssistantErrorMessage(error, id) {
  return createAssistantMessage(`Lỗi: ${error.message}`, [], id);
}

function getChatTitleFromMessages(messages) {
  const firstUserMessage = messages.find((message) => message.role === "user");

  return firstUserMessage ? firstUserMessage.content.slice(0, 32) : "New chat";
}

function getInitialChatState() {
  if (typeof window === "undefined") {
    const firstChat = createNewChat();

    return {
      chats: [firstChat],
      activeChatId: firstChat.id,
    };
  }

  try {
    const storedChats = window.localStorage.getItem(CHAT_STORAGE_KEY);
    const storedActiveChatId = window.localStorage.getItem(ACTIVE_CHAT_STORAGE_KEY);

    if (!storedChats || !storedActiveChatId) {
      throw new Error("Missing chat storage");
    }

    const parsedChats = JSON.parse(storedChats);

    if (!Array.isArray(parsedChats) || parsedChats.length === 0) {
      throw new Error("Invalid chat storage");
    }

    const hasActiveChat = parsedChats.some((chat) => chat.id === storedActiveChatId);

    if (!hasActiveChat) {
      throw new Error("Missing active chat");
    }

    return {
      chats: parsedChats,
      activeChatId: storedActiveChatId,
    };
  } catch {
    const firstChat = createNewChat();

    return {
      chats: [firstChat],
      activeChatId: firstChat.id,
    };
  }
}

function App() {
  const initialChatState = useMemo(() => getInitialChatState(), []);
  const [chats, setChats] = useState(initialChatState.chats);
  const [activeChatId, setActiveChatId] = useState(initialChatState.activeChatId);
  const [loading, setLoading] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId) ?? null;

  useEffect(() => {
    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
    window.localStorage.setItem(ACTIVE_CHAT_STORAGE_KEY, activeChatId);
  }, [activeChatId, chats]);

  useEffect(() => {
    if (activeChat || chats.length === 0) return;

    setActiveChatId(chats[0].id);
  }, [activeChat, chats]);

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

  function handleClearAllChats() {
    const newChat = createNewChat();

    window.localStorage.removeItem(CHAT_STORAGE_KEY);
    window.localStorage.removeItem(ACTIVE_CHAT_STORAGE_KEY);
    setChats([newChat]);
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

      updateActiveChat((chat) => ({
        ...chat,
        messages: [...chat.messages, createAssistantMessage(data.answer, data.sources || [])],
      }));
    } catch (error) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: [...chat.messages, createAssistantErrorMessage(error)],
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
          createAssistantMessage("Đã rebuild knowledge base thành công."),
        ],
      }));
    } catch (error) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: [...chat.messages, createAssistantMessage(`Ingest failed: ${error.message}`)],
      }));
    } finally {
      setLoading(false);
    }
  }

  function handleUploaded(message) {
    updateActiveChat((chat) => ({
      ...chat,
      messages: [...chat.messages, createAssistantMessage(message)],
    }));
  }

  async function handleRegenerate(messageId) {
    const currentChat = chats.find((chat) => chat.id === activeChatId);

    if (!currentChat) return;

    const messageIndex = currentChat.messages.findIndex((message) => message.id === messageId);

    if (messageIndex === -1) return;

    const previousUserMessage = [...currentChat.messages]
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!previousUserMessage) return;

    setLoading(true);
    setRegeneratingMessageId(messageId);

    try {
      const data = await askRuvie(previousUserMessage.content);

      updateActiveChat((chat) => ({
        ...chat,
        messages: chat.messages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                content: data.answer,
                sources: data.sources || [],
              }
            : message
        ),
      }));
    } catch (error) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: chat.messages.map((message) =>
          message.id === messageId ? createAssistantErrorMessage(error, message.id) : message
        ),
      }));
    } finally {
      setRegeneratingMessageId(null);
      setLoading(false);
    }
  }

  async function handleEditUserMessage(messageId, nextQuestion) {
    const trimmedQuestion = nextQuestion.trim();
    const currentChat = chats.find((chat) => chat.id === activeChatId);

    if (!currentChat || !trimmedQuestion) return false;

    const messageIndex = currentChat.messages.findIndex((message) => message.id === messageId);

    if (messageIndex === -1 || currentChat.messages[messageIndex]?.role !== "user") {
      return false;
    }

    const updatedUserMessage = {
      ...currentChat.messages[messageIndex],
      content: trimmedQuestion,
    };
    const nextMessages = [...currentChat.messages.slice(0, messageIndex), updatedUserMessage];

    updateActiveChat((chat) => ({
      ...chat,
      title: getChatTitleFromMessages(nextMessages),
      messages: nextMessages,
    }));

    setLoading(true);

    try {
      const data = await askRuvie(trimmedQuestion);

      updateActiveChat((chat) => ({
        ...chat,
        messages: [...chat.messages, createAssistantMessage(data.answer, data.sources || [])],
      }));

      return true;
    } catch (error) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: [...chat.messages, createAssistantErrorMessage(error)],
      }));

      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell
      chats={chats}
      activeChatId={activeChatId}
      activeChat={activeChat}
      loading={loading}
      onNewChat={handleNewChat}
      onClearAllChats={handleClearAllChats}
      onSelectChat={setActiveChatId}
      onAsk={handleAsk}
      onEditUserMessage={handleEditUserMessage}
      onRegenerate={handleRegenerate}
      onIngest={handleIngest}
      onUploaded={handleUploaded}
      regeneratingMessageId={regeneratingMessageId}
    />
  );
}

export default App;
