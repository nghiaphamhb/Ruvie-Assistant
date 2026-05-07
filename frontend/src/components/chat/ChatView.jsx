import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

function ChatView({
  chat,
  loading,
  onAsk,
  onEditUserMessage,
  onRegenerate,
  regeneratingMessageId,
}) {
  const hasConversation = chat?.messages?.some((m) => m.role === "user");

  return (
    <main className="chat-page">
      <div className="bg-overlay" />

      <div className={hasConversation ? "chat-container" : "home-container"}>
        {!hasConversation ? (
          <div className="home-screen">
            <div className="home-logo" />

            <h1>Hey!</h1>
            <h2>How may I assist you today?</h2>

            <select className="model-select">
              <option>OpenRouter: GPT-4o-mini</option>
              <option>OpenRouter: Claude</option>
              <option>OpenRouter: Gemini</option>
            </select>

            <ChatInput onSend={onAsk} disabled={loading} variant="home" />

            <div className="suggestion-row">
              <button onClick={() => onAsk("Tóm tắt tài liệu hiện có")}>Summarize Docs</button>
              <button onClick={() => onAsk("Các ý chính trong tài liệu là gì?")}>Key Points</button>
              <button onClick={() => onAsk("Tạo báo cáo ngắn từ tài liệu")}>Generate Report</button>
              <button onClick={() => onAsk("Tài liệu này nói về chủ đề gì?")}>Explain Docs</button>
            </div>
          </div>
        ) : (
          <>
            <MessageList
              messages={chat?.messages || []}
              loading={loading}
              onEditUserMessage={onEditUserMessage}
              onRegenerate={onRegenerate}
              regeneratingMessageId={regeneratingMessageId}
            />
            <ChatInput onSend={onAsk} disabled={loading} />
          </>
        )}
      </div>
    </main>
  );
}

export default ChatView;
