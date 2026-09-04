import { type ReactNode } from 'react';
type Props = { children: ReactNode; delay?: number; cor?: string; label?: string; block?: boolean };
export function AIScanHighlight({ children, delay = 0, cor = '#00f5ff', label, block = false }: Props) {
  return (
    <span className={block ? 'ai-focus ai-focus--block' : 'ai-focus'} style={{ '--ai-delay': `${delay}s`, '--ai-color': cor } as React.CSSProperties}>
      {children}
      {label && <span className="ai-focus-label">{label}</span>}
      <span className="ai-focus-arrow" aria-hidden="true">→</span>
    </span>
  );
}
