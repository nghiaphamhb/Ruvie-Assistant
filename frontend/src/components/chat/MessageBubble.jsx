import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import SourceList from "./SourceList";
import ruvieAvatar from "../../assets/avatar.png";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content ?? "");
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      {!isUser && <img src={ruvieAvatar} alt="Ruvie" className="message-avatar" />}
      <div className={`message-bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}>
        {!isUser && (
          <button
            type="button"
            className={`copy-button ${copied ? "copied" : ""}`}
            onClick={handleCopy}
            aria-label={copied ? "Copied message" : "Copy message"}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        )}

        <div className="message-role">{isUser ? "You" : "Ruvie"}</div>

        <div className="message-content">{message.content}</div>

        {!isUser && message.sources?.length > 0 && <SourceList sources={message.sources} />}
      </div>
    </div>
  );
}
