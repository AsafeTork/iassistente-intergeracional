import { useState } from 'react';

type PontoFoco = { x: number; y: number; w: number; h: number; rotulo: string };

type Props = {
  /** Clique no segundo hotspot (Continuar real). */
  onAvancar?: () => void;
  onMensagem?: (texto: string) => void;
};

const FOCOS: Record<'identificar' | 'continuar', PontoFoco> = {
  identificar: { x: 8, y: 30, w: 84, h: 34, rotulo: 'Digite seu CPF aqui' },
  continuar: { x: 8, y: 62, w: 84, h: 12, rotulo: 'Toque em Continuar' },
};

/**
 * GovFrame: UI EXATA do login gov.br, renderizada em iframe isolado com o
 * CSS oficial (@govbr-ds/core). Dimensão do celular; a AI cerca 1 elemento
 * por vez e o overlay transparente converte o toque em avanço da demo.
 */
export function GovFrame({ onAvancar, onMensagem }: Props) {
  // 1 elemento por vez: primeiro o campo, depois o Continuar.
  const [etapa, setEtapa] = useState<'identificar' | 'continuar'>('identificar');
  const foco = FOCOS[etapa];
  const srcDoc = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/vendor/govbr-core.min.css"><style>html,body{margin:0;padding:0;background:#fff;font-size:13px}.gov-frame{max-width:100%;margin:0 auto;padding:10px}.gov-logo{font-weight:800;color:#1351b4;font-size:1rem}.gov-bar{height:3px;background:#ffcd07;margin:6px 0 10px}.br-button{white-space:normal !important;height:auto !important;min-height:44px;padding-top:8px !important;padding-bottom:8px !important}.br-item .content{flex-wrap:wrap;gap:2px}.br-input input{font-size:.8rem}</style></head><body><div class="gov-frame"><header><span class="gov-logo">gov<span style="font-weight:400">.br</span></span><div class="gov-bar"></div></header><main><h2 style="font-size:1rem;margin:0 0 10px">Identifique-se no gov.br com:</h2><div class="br-card" style="margin-bottom:12px"><div class="card-content"><div class="br-input"><label for="cpf">Número do CPF</label><input id="cpf" type="text" placeholder="Digite seu CPF para criar ou acessar sua conta gov.br" readonly><button class="br-button primary block mt-3" type="button">Continuar</button></div></div></div><p class="text-down-01">Outras opções de identificação:</p><div class="br-list"><div class="br-item"><div class="content"><strong>Login com seu banco</strong><span>SUA CONTA SERÁ PRATA</span></div></div></div></main></div></body></html>`;

  return (
    <div className="govframe" role="img" aria-label={`Tela fiel do gov.br. ${foco.rotulo}.`}>
      <iframe title="Tela fiel do login gov.br" srcDoc={srcDoc} scrolling="no" tabIndex={-1} aria-hidden="true" />
      <div
        className="govframe-foco"
        style={{ left: `${foco.x}%`, top: `${foco.y}%`, width: `${foco.w}%`, height: `${foco.h}%` }}
      >
        <span className="govframe-etiqueta">{foco.rotulo}</span>
      </div>
      <button
        type="button"
        className="govframe-hotspot"
        style={{ left: `${foco.x}%`, top: `${foco.y}%`, width: `${foco.w}%`, height: `${foco.h}%` }}
        aria-label={foco.rotulo}
        onClick={() => {
          if (etapa === 'identificar') {
            setEtapa('continuar');
            onMensagem?.('Esse é o campo de CPF do gov.br de verdade. Agora toque em Continuar.');
          } else {
            onMensagem?.('Muito bem! Continuando.');
            onAvancar?.();
          }
        }}
      />
    </div>
  );
}
