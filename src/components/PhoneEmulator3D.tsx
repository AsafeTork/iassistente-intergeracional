import { useCallback, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  titulo?: string;
};

export function PhoneEmulator3D({ children, titulo }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotacao, setRotacao] = useState({ x: 0, y: 0 });
  const [pressionado, setPressionado] = useState(false);

  const tratarMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotacao({ x: y * -18, y: x * 18 });
  }, []);

  const tratarMouseLeave = useCallback(() => {
    setRotacao({ x: 0, y: 0 });
  }, []);

  const estiloTransform = {
    transform: `perspective(900px) rotateX(${rotacao.x}deg) rotateY(${rotacao.y}deg) ${pressionado ? 'scale(0.97)' : 'scale(1)'}`,
  };

  const estiloSombra = {
    boxShadow: `
      ${rotacao.y * -1.5}px ${rotacao.x * 1.5}px 40px rgba(0,0,0,0.25),
      ${rotacao.y * -0.5}px ${rotacao.x * 0.5}px 10px rgba(0,0,0,0.15),
      inset 0 0 0 1px rgba(255,255,255,0.08)
    `,
  };

  const estiloReflexo = {
    background: `linear-gradient(
      ${105 + rotacao.y * 2}deg,
      transparent 40%,
      rgba(255,255,255,0.06) 45%,
      rgba(255,255,255,0.12) 50%,
      rgba(255,255,255,0.06) 55%,
      transparent 60%
    )`,
  };

  return (
    <div
      className="phone-3d-container"
      ref={containerRef}
      onMouseMove={tratarMouseMove}
      onMouseLeave={tratarMouseLeave}
    >
      {titulo && <p className="phone-3d-titulo">{titulo}</p>}

      <div className="phone-3d-perspectiva" style={estiloTransform}>
        <div className="phone-3d-frame" style={estiloSombra}>
          <div className="phone-3d-notch">
            <div className="phone-3d-notch-camera" />
          </div>

          <div className="phone-3d-botoes-lado">
            <div className="phone-3d-btn-silent" />
            <div className="phone-3d-btn-vol-up" />
            <div className="phone-3d-btn-vol-down" />
          </div>

          <div className="phone-3d-btn-power" />

          <div className="phone-3d-tela">
            <div className="phone-3d-statusbar">
              <span>9:41</span>
              <span className="phone-3d-status-icons">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
                  <rect x="0" y="7" width="3" height="5" rx="0.5" opacity="0.4"/>
                  <rect x="4" y="5" width="3" height="7" rx="0.5" opacity="0.6"/>
                  <rect x="8" y="3" width="3" height="9" rx="0.5" opacity="0.8"/>
                  <rect x="12" y="0" width="3" height="12" rx="0.5"/>
                </svg>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
                  <rect x="0" y="0" width="15" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2"/>
                  <rect x="1.5" y="1.5" width="10" height="9" rx="1"/>
                  <rect x="15.5" y="3.5" width="2" height="5" rx="0.8"/>
                </svg>
              </span>
            </div>

            <div className="phone-3d-conteudo">
              {children}
            </div>

            <div className="phone-3d-homebar" />
          </div>

          <div className="phone-3d-reflexo" style={estiloReflexo} />
        </div>
      </div>

      <button
        className="phone-3d-toucharea"
        onMouseDown={() => setPressionado(true)}
        onMouseUp={() => setPressionado(false)}
        onMouseLeave={() => setPressionado(false)}
        aria-label="Área de interação do emulador 3D"
      />
    </div>
  );
}
