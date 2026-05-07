import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function MessageList({
  messages,
  loading,
  onEditUserMessage,
  onRegenerate,
  regeneratingMessageId,
}) {
  const messageListRef = useRef(null);
  const lastAssistantIndex = messages.reduce(
    (lastIndex, message, index) => (message.role === "assistant" ? index : lastIndex),
    -1
  );
  const canRegenerateLastAssistant =
    lastAssistantIndex > 0 && messages[lastAssistantIndex - 1]?.role === "user";

  useEffect(() => {
    const scrollContainer = messageListRef.current?.closest(".chat-page");

    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <section ref={messageListRef} className="chat-window">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          loading={loading}
          onEditUserMessage={onEditUserMessage}
          showRegenerate={canRegenerateLastAssistant && index === lastAssistantIndex}
          onRegenerate={onRegenerate}
          isRegenerating={regeneratingMessageId === message.id}
        />
      ))}

      {loading && (
        <div className="typing">
          <span />
          <span />
          <span />
        </div>
      )}
    </section>
  );
}

export default MessageList;
