import { useState } from 'react';
import { BrButton, BrCard, BrInput } from '@govbr-ds/webcomponents-react';
import '@govbr-ds/core/dist/core-tokens.css';
import { CAMINHOS_NIVEL, NIVEIS_CONTA, type NivelConta } from '../data/mock';
import { GovFrame } from './GovFrame';

/**
 * GovbrNativo: tela de login gov.br renderizada com os Web Components REAIS do
 * GovBR-DS (@govbr-ds/webcomponents-react) — BrInput (CPF), BrButton
 * (Continuar) e BrCard. Também apresenta os caminhos que sobem o nível da
 * conta (banco → prata; facial CNH/TSE e QR CIN → ouro).
 *
 * Fallback: se os custom elements não estiverem registrados (browser antigo,
 * SSR, CDN incompleta), renderiza o GovFrame — a réplica exata em iframe
 * isolado já existente — preservando a demonstração.
 */
const WBC_OK =
  typeof customElements !== 'undefined' &&
  typeof document !== 'undefined' &&
  Boolean(
    customElements.get('br-button') &&
      customElements.get('br-input') &&
      customElements.get('br-card'),
  );

type Props = {
  /** Avançar para o fluxo de login (senha/sms). */
  onAvancar?: () => void;
  onMensagem?: (texto: string) => void;
};

export function GovbrNativo({ onAvancar, onMensagem }: Props) {
  const [cpf, setCpf] = useState('');
  const [erroCpf, setErroCpf] = useState(false);
  const [ajudaNivel, setAjudaNivel] = useState<NivelConta | null>(null);

  if (!WBC_OK) {
    return <GovFrame onAvancar={onAvancar} onMensagem={onMensagem} />;
  }

  const numerosCpf = cpf.replace(/\D/g, '');
  const nivel = ajudaNivel ? NIVEIS_CONTA[ajudaNivel] : null;
  const caminhosPara = ajudaNivel
    ? CAMINHOS_NIVEL.filter((c) => c.para === ajudaNivel)
    : [];

  function continuar() {
    if (numerosCpf.length !== 11) {
      setErroCpf(true);
      onMensagem?.('Parece que faltou algum número do CPF. Digite os 11 números para continuar.');
      return;
    }
    setErroCpf(false);
    onMensagem?.('Muito bem! Continuando.');
    onAvancar?.();
  }

  function mostrarCaminho(id: NivelConta) {
    setAjudaNivel((atual) => (atual === id ? null : id));
    const n = NIVEIS_CONTA[id];
    onMensagem?.(
      `Nível ${n.rotulo}: ${CAMINHOS_NIVEL.some((c) => c.para === id) ? 'você pode subir de nível com ' + CAMINHOS_NIVEL.filter((c) => c.para === id).map((c) => c.fala).join(' ou ') : 'acesso máximo liberado.'}`,
    );
  }

  return (
    <div className="ph-govbr ph-govbr-nativo">
      <header className="ph-govbr-header">
        <span className="gov-logo" role="img" aria-label="gov.br">
          gov<small>.br</small>
        </span>
        <button type="button" className="ph-govbr-menu-btn" aria-label="Menu do gov.br">
          <svg viewBox="0 0 24 16" width="20" height="14" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="24" height="2" rx="1" fill="#1351b4" />
            <rect x="0" y="7" width="24" height="2" rx="1" fill="#1351b4" />
            <rect x="0" y="14" width="24" height="2" rx="1" fill="#1351b4" />
          </svg>
        </button>
      </header>
      <div className="ph-govbr-faixa" />

      <main className="ph-govbr-conteudo">
        <h1 className="ph-govbr-titulo">Identifique-se no gov.br com:</h1>

        <div className="ph-govbr-nativo-card">
          <BrCard>
            <div className="ph-govbr-nativo-campo">
              <BrInput
                label="Número do CPF"
                placeholder="Digite seu CPF para criar ou acessar sua conta gov.br"
                type="text"
                inputMode="numeric"
                onValueChange={(e) => {
                  setCpf(String(e.detail ?? ''));
                  if (erroCpf) setErroCpf(false);
                }}
                state={erroCpf ? ('danger' as const) : undefined}
              />
              {erroCpf && (
                <p className="ph-govbr-nativo-aviso">
                  Digite os 11 números do CPF, apenas números. Dados ficam só neste aparelho.
                </p>
              )}
            </div>
            <BrButton type="button" emphasis="primary" shape="block" density="medium" onClick={continuar}>
              Continuar
            </BrButton>
          </BrCard>
        </div>

        <p className="ph-govbr-outras">Outras opções de identificação:</p>
        <div className="ph-govbr-opcoes" role="group" aria-label="Outras opções de identificação">
          <button
            type="button"
            className={`ph-govbr-opcao ${ajudaNivel === 'prata' ? 'atual' : ''}`}
            onClick={() => mostrarCaminho('prata')}
          >
            <span className="ph-govbr-opcao-titulo">
              Login com seu banco
              <small className="ph-govbr-selo selo-prata">SUA CONTA SERÁ PRATA</small>
            </span>
          </button>
          <button
            type="button"
            className={`ph-govbr-opcao ${ajudaNivel === 'ouro' ? 'atual' : ''}`}
            onClick={() => mostrarCaminho('ouro')}
          >
            <span className="ph-govbr-opcao-titulo">
              Reconhecimento facial (CNH/TSE) e QR Code da CIN
              <small className="ph-govbr-selo selo-ouro">SUA CONTA SERÁ OURO</small>
            </span>
          </button>
        </div>

        {nivel && (
          <div className="ph-govbr-nivel-ajuda" role="status">
            <strong>Nível {nivel.rotulo}:</strong> {nivel.descricao}
            {caminhosPara.length > 0 && (
              <ul className="ph-govbr-nivel-caminhos">
                {caminhosPara.map((c, i) => (
                  <li key={`${c.para}-${i}`}>{c.fala}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}