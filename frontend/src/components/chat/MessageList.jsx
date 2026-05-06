import MessageBubble from "./MessageBubble";

function MessageList({ messages, loading }) {
  return (
    <section className="chat-window">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
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
