export default function SourceList({ sources }) {
  return (
    <div className="source-list">
      <p>Sources</p>

      {sources.map((source, index) => (
        <div className="source-card" key={index}>
          <strong>{source.file}</strong>
          <span>{source.preview}</span>
        </div>
      ))}
    </div>
  );
}
