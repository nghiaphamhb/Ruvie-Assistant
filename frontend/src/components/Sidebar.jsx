import { Database, MessageSquarePlus } from "lucide-react";
import UploadPanel from "./UploadPanel";

export default function Sidebar({ onIngest}, onUploaded ) {
    return (
        <aside className="sidebar">
        <div className="brand">
            <div className="brand-mark"/>
            <div>
            <h2>Ruvie</h2>
            <p>Ru × Vie Assistant</p>
            </div>
        </div>

        <button className="side-button">
            <MessageSquarePlus size={18} />
            New chat
        </button>

        <UploadPanel onUploaded={onUploaded} />

        <button className="side-button" onClick={onIngest}>
            <Database size={18} />
            Rebuild knowledge
        </button>
        </aside>
    );
}