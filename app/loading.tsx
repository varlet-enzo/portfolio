export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-1.5 h-6 bg-accent-primary rounded-sm"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.15}s infinite alternate`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
        <p className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Loading...
        </p>
      </div>
      <style>{`
        @keyframes pulse {
          from { transform: scaleY(0.4); opacity: 0.4; }
          to   { transform: scaleY(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
