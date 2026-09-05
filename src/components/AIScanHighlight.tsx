import { type ReactNode } from 'react';
type Props = { children: ReactNode; delay?: number; cor?: string; label?: string; block?: boolean; ativo?: boolean };
export function AIScanHighlight({ children, delay = 0, cor = '#00f5ff', label, block = false, ativo = false }: Props) {
  const cls = [
    'ai-focus',
    block && 'ai-focus--block',
    ativo && 'ai-focus--ativo',
  ].filter(Boolean).join(' ');
  return (
    <span className={cls} style={{ '--ai-delay': `${delay}s`, '--ai-color': cor } as React.CSSProperties}>
      {children}
      {label && <span className={`ai-focus-label${ativo ? ' ai-focus-label--ativo' : ''}`}>{label}</span>}
      <span className="ai-focus-arrow" aria-hidden="true">→</span>
    </span>
  );
}
