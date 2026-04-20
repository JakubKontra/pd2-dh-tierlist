export function LoadingState({ message = "Summoning build data…" }: { message?: string }) {
  return (
    <div className="panel p-10 flex flex-col items-center gap-4">
      <div
        className="h-10 w-10 rounded-full animate-spin"
        style={{
          border: "3px solid transparent",
          borderTopColor: "var(--color-d2-gold)",
          borderRightColor: "var(--color-d2-gold)",
        }}
      />
      <p className="text-stone-400 font-mono text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="panel p-8 text-center">
      <h3 className="text-d2-red text-xl mb-2">Failed to load tier list</h3>
      <p className="text-stone-400 text-sm font-mono mb-4">{error.message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 panel-hi hover:border-d2-gold text-d2-gold uppercase tracking-wider text-sm"
      >
        Retry
      </button>
    </div>
  );
}
