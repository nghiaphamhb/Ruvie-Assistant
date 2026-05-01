import { Send } from "lucide-react";
import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
    const [question, setQuestion] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        const value = question.trim();
        if(!value) return;

        onSend(value);
        setQuestion("");
    }

    return (
        <form className="chat-input-bar" onSubmit={handleSubmit}>
        <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask Ruvie about your documents..."
            disabled={disabled}
        />

        <button type="submit">
            <Send size={18} disabled={disabled}/>
        </button>
        </form>
    );
}
