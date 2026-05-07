import { Database, MessageSquarePlus, Trash2 } from "lucide-react";
import UploadPanel from "../documents/UploadPanel";

function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onClearAllChats,
  onSelectChat,
  onIngest,
  onUploaded,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <h2>Ruvie</h2>
          <p>Knowledge Assistant</p>
        </div>
      </div>

      <button className="side-button" onClick={onNewChat}>
        <MessageSquarePlus size={18} />
        Start a New Chat
      </button>

      <UploadPanel onUploaded={onUploaded} />

      <button className="side-button" onClick={onIngest}>
        <Database size={18} />
        Rebuild knowledge
      </button>

      <button className="side-button side-button-danger" onClick={onClearAllChats}>
        <Trash2 size={18} />
        Clear all chats
      </button>

      <div className="chat-history">
        <p className="section-title">Recent Chats</p>

        {chats.map((chat) => (
          <button
            key={chat.id}
            className={chat.id === activeChatId ? "chat-history-item active" : "chat-history-item"}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.title}
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
