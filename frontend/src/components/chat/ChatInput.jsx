import { useState } from "react";
import { Send, Paperclip, Mic } from "lucide-react";

function ChatInput({ onSend, disabled, variant = "chat" }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const value = question.trim();
    if (!value) return;

    onSend(value);
    setQuestion("");
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();

    const value = question.trim();
    if (!value || disabled) return;

    onSend(value);
    setQuestion("");
  }

  return (
    <form
      className={variant === "home" ? "home-input-box" : "chat-input-bar"}
      onSubmit={handleSubmit}
    >
      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything"
        disabled={disabled}
      />

      <div className="input-actions">
        <button type="button" className="icon-button">
          <Paperclip size={20} />
        </button>

        <div className="right-actions">
          <button type="button" className="icon-button">
            <Mic size={20} />
          </button>

          <button type="submit" disabled={disabled} className="send-button">
            <Send size={18} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default ChatInput;
