import { useEffect, useState } from "react";
import { Check, Copy, PencilLine, RefreshCcw, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SourceList from "./SourceList";
import ruvieAvatar from "../../assets/avatar.png";

export default function MessageBubble({
  message,
  loading = false,
  onEditUserMessage,
  showRegenerate = false,
  onRegenerate,
  isRegenerating = false,
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(message.content ?? "");

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

  function handleStartEdit() {
    setDraftContent(message.content ?? "");
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setDraftContent(message.content ?? "");
    setIsEditing(false);
  }

  async function handleSaveEdit() {
    const didSave = await onEditUserMessage?.(message.id, draftContent);

    if (didSave) {
      setIsEditing(false);
    }
  }

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      {!isUser && <img src={ruvieAvatar} alt="Ruvie" className="message-avatar" />}
      <div className={`message-bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}>
        <div className="message-role">{isUser ? "You" : "Ruvie"}</div>

        {isUser && isEditing ? (
          <div className="message-edit-shell">
            <textarea
              className="message-edit-textarea"
              value={draftContent}
              onChange={(event) => setDraftContent(event.target.value)}
              disabled={loading}
              rows={4}
            />

            <div className="message-actions user-message-actions edit-mode-actions">
              <button
                type="button"
                className="message-action-button cancel-button"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                <X size={14} />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                className="message-action-button save-button"
                onClick={handleSaveEdit}
                disabled={loading || !draftContent.trim()}
              >
                <Check size={14} />
                <span>{loading ? "Saving" : "Save"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={`message-content ${!isUser ? "assistant-message-content" : ""}`}>
            {isUser ? (
              message.content
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content ?? ""}</ReactMarkdown>
            )}
          </div>
        )}

        {!isUser && message.sources?.length > 0 && <SourceList sources={message.sources} />}

        {isUser && !isEditing && (
          <div className="message-actions user-message-actions">
            <button
              type="button"
              className="message-action-button edit-button"
              onClick={handleStartEdit}
              disabled={loading}
              aria-label="Edit message"
            >
              <PencilLine size={14} />
              <span>Edit</span>
            </button>
          </div>
        )}

        {!isUser && (
          <div className="message-actions">
            {showRegenerate && (
              <button
                type="button"
                className={`message-action-button regenerate-button ${isRegenerating ? "loading" : ""}`}
                onClick={() => onRegenerate?.(message.id)}
                disabled={loading || isRegenerating}
                aria-label={isRegenerating ? "Regenerating message" : "Regenerate message"}
              >
                <RefreshCcw size={14} />
                <span>{isRegenerating ? "Regenerating" : "Regenerate"}</span>
              </button>
            )}

            <button
              type="button"
              className={`message-action-button copy-button ${copied ? "copied" : ""}`}
              onClick={handleCopy}
              aria-label={copied ? "Copied message" : "Copy message"}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
