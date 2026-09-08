type Props = {
  linhas?: number;
  className?: string;
};

export function Skeleton({ linhas = 3, className = '' }: Props) {
  const total = Math.max(1, Math.floor(linhas));
  return (
    <div
      className={`skeleton ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="Carregando conteúdo"
    >
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="skeleton-linha" aria-hidden="true" />
      ))}
    </div>
  );
}

export default Skeleton;
