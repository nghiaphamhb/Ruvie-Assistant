import MessageBubble from "./MessageBubble";

function ChatWindow({ messages, loading }) {
    return (
        <section className="chat-window">
        {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
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

export default ChatWindow;