import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  cor?: string;
};

export function AIScanHighlight({ children, delay = 0, cor = '#00f5ff' }: Props) {
  return (
    <div
      className="ai-scan"
      style={{
        '--ai-delay': `${delay}s`,
        '--ai-color': cor,
      } as React.CSSProperties}
    >
      <div className="ai-scan-glow" />
      <div className="ai-scan-line" />
      <div className="ai-scan-brilho ai-scan-tl" />
      <div className="ai-scan-brilho ai-scan-tr" />
      <div className="ai-scan-brilho ai-scan-br" />
      <div className="ai-scan-brilho ai-scan-bl" />
      {children}
    </div>
  );
}