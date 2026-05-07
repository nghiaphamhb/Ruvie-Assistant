import { useState } from "react";

export default function SourceList({ sources }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="source-list">
      <button
        type="button"
        className={`source-toggle ${expanded ? "expanded" : ""}`}
        onClick={() => setExpanded((prev) => !prev)}
        aria-label={expanded ? "Hide sources" : "Show sources"}
        aria-expanded={expanded}
      >
        <span className="source-toggle-arrow">&gt;</span>
        <span className="source-toggle-label">Sources</span>
        <span className="source-toggle-count">{sources.length}</span>
        <span className="source-toggle-state">{expanded ? "Hide" : "Show"}</span>
      </button>

      {expanded && (
        <div className="source-stack">
          {sources.map((source, index) => (
            <div className="source-card" key={index}>
              <strong>{source.file}</strong>
              <span>{source.preview}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
