import SourceList from "./SourceList";

export default function MessageBubble({ message }) {
    const isUser = message.role === "user";

    return (
        <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
        <div className={`message-bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}>
            <div className="message-role">
            {isUser ? "You" : "Ruvie"}
            </div>

            <div className="message-content">
            {message.content}
            </div>

            {!isUser && message.sources?.length > 0 && (
            <SourceList sources={message.sources} />
            )}
        </div>
        </div>
    );
}