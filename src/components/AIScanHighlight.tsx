import { type ReactNode } from 'react';
type Props = { children: ReactNode; delay?: number; cor?: string; label?: string };
export function AIScanHighlight({ children, delay = 0, cor = '#00f5ff', label }: Props) {
  return (
    <span className="ai-focus" style={{ '--ai-delay': `${delay}s`, '--ai-color': cor } as React.CSSProperties}>
      {children}
      {label && <span className="ai-focus-label">{label}</span>}
      <span className="ai-focus-arrow" aria-hidden="true">→</span>
    </span>
  );
}
