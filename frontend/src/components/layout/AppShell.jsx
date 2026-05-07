import Sidebar from "./Sidebar";
import ChatView from "../chat/ChatView";

function AppShell({
  chats,
  activeChatId,
  activeChat,
  loading,
  onNewChat,
  onClearAllChats,
  onSelectChat,
  onAsk,
  onEditUserMessage,
  onRegenerate,
  onIngest,
  onUploaded,
  regeneratingMessageId,
}) {
  return (
    <div className="app-shell">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={onNewChat}
        onClearAllChats={onClearAllChats}
        onSelectChat={onSelectChat}
        onIngest={onIngest}
        onUploaded={onUploaded}
      />

      <ChatView
        chat={activeChat}
        loading={loading}
        onAsk={onAsk}
        onEditUserMessage={onEditUserMessage}
        onRegenerate={onRegenerate}
        regeneratingMessageId={regeneratingMessageId}
      />
    </div>
  );
}

export default AppShell;
