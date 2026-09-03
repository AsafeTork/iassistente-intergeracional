import { useCallback, useRef, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  mensagem?: string;
};

export function PhoneEmulator3D({ children, mensagem }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotacao, setRotacao] = useState({ x: 0, y: 0 });

  const tratarMouseMove = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotacao({ x: y * -12, y: x * 12 });
  }, []);

  const tratarMouseLeave = useCallback(() => {
    setRotacao({ x: 0, y: 0 });
  }, []);

  const estiloTransform = {
    transform: `perspective(1200px) rotateX(${rotacao.x}deg) rotateY(${rotacao.y}deg)`,
  };

  const estiloSombra = {
    boxShadow: `
      ${rotacao.y * -2}px ${rotacao.x * 2}px 50px rgba(0,0,0,0.35),
      ${rotacao.y * -1}px ${rotacao.x * 1}px 15px rgba(0,0,0,0.2),
      0 25px 60px rgba(0,0,0,0.45),
      inset 0 1px 0 rgba(255,255,255,0.15),
      inset 0 -1px 0 rgba(0,0,0,0.3)
    `,
  };

  const estiloReflexo = {
    background: `linear-gradient(
      ${105 + rotacao.y * 3}deg,
      transparent 30%,
      rgba(255,255,255,0.03) 40%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.03) 60%,
      transparent 70%
    )`,
  };

  return (
    <div
      className="phone-3d-container"
      ref={containerRef}
      onMouseMove={tratarMouseMove}
      onMouseLeave={tratarMouseLeave}
    >
      {/* SVG Contorno AI - animação de scan */}
      <svg
        className="phone-ai-contorno"
        viewBox="0 0 348 688"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Contorno principal - retângulo arredondado */}
        <path
          d="M48 4 H280 C310 4, 344 14, 344 48 V640 C344 674, 310 684, 280 684 H48 C18 684, 4 674, 4 640 V48 C4 14, 18 4, 48 4 Z"
          stroke="url(#ai-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="phone-ai-path"
        />
        {/* Cantos brilhantes */}
        <circle cx="48" cy="4" r="4" fill="#00f5ff" className="phone-ai-dot phone-ai-dot-tl" />
        <circle cx="280" cy="4" r="4" fill="#00f5ff" className="phone-ai-dot phone-ai-dot-tr" />
        <circle cx="280" cy="684" r="4" fill="#00f5ff" className="phone-ai-dot phone-ai-dot-br" />
        <circle cx="48" cy="684" r="4" fill="#00f5ff" className="phone-ai-dot phone-ai-dot-bl" />
        {/* Linha de scan vertical */}
        <line x1="4" y1="0" x2="344" y2="0" stroke="#00f5ff" strokeWidth="1" opacity="0.6" className="phone-ai-scanline" />
        {/* Coordenadas animadas */}
        <text x="350" y="48" className="phone-ai-coord" fill="#00f5ff" fontSize="9" fontFamily="monospace">x:0 y:0</text>
        <text x="350" y="640" className="phone-ai-coord phone-ai-coord-b" fill="#00f5ff" fontSize="9" fontFamily="monospace">x:0 y:684</text>
        <defs>
          <linearGradient id="ai-grad" x1="0" y1="0" x2="348" y2="688" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0" />
            <stop offset="20%" stopColor="#00f5ff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7b61ff" stopOpacity="1" />
            <stop offset="80%" stopColor="#00f5ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00f5ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <div className="phone-3d-perspectiva" style={estiloTransform}>
        <div className="phone-3d-frame" style={estiloSombra}>
          <div className="phone-3d-btn-lateral-esq">
            <div className="phone-3d-btn-hw phone-3d-btn-mudo" title="Botão silenciar" />
            <div className="phone-3d-btn-hw phone-3d-btn-vol" title="Volume +" />
            <div className="phone-3d-btn-hw phone-3d-btn-vol" title="Volume -" />
          </div>
          <div className="phone-3d-btn-lateral-dir">
            <div className="phone-3d-btn-hw phone-3d-btn-power" title="Power" />
          </div>

          <div className="phone-3d-tela">
            <div className="phone-3d-notch">
              <div className="phone-3d-notch-camera" />
            </div>
            <div className="phone-3d-statusbar">
              <span className="phone-3d-hora">9:41</span>
              <span className="phone-3d-status-icons">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
                  <rect x="0" y="6" width="2.5" height="4" rx="0.5" opacity="0.4"/>
                  <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" opacity="0.6"/>
                  <rect x="7" y="2" width="2.5" height="8" rx="0.5" opacity="0.8"/>
                  <rect x="10.5" y="0" width="2.5" height="10" rx="0.5"/>
                </svg>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
                  <rect x="0.5" y="0.5" width="12.5" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <rect x="2" y="2" width="8" height="6" rx="0.8"/>
                  <rect x="13.5" y="3" width="2" height="4" rx="0.6"/>
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

      {/* Bolinha de chat do assistente */}
      {mensagem && (
        <div className="phone-chat-bubble">
          <div className="phone-chat-dot" />
          <div className="phone-chat-texto">{mensagem}</div>
        </div>
      )}
    </div>
  );
}
