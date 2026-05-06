import Sidebar from "./Sidebar";
import ChatView from "../chat/ChatView";

function AppShell({
  chats,
  activeChatId,
  activeChat,
  loading,
  onNewChat,
  onSelectChat,
  onAsk,
  onIngest,
  onUploaded,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={onNewChat}
        onSelectChat={onSelectChat}
        onIngest={onIngest}
        onUploaded={onUploaded}
      />

      <ChatView chat={activeChat} loading={loading} onAsk={onAsk} />
    </div>
  );
}

export default AppShell;
