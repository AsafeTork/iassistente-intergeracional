import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type AcessibilidadeConfig = {
  fonteGrande: boolean;
  altoContraste: boolean;
  modoSimples: boolean;
  leituraEmVoz: boolean;
};

const CHAVE = 'iassistente:config:v1';

const PADRAO: AcessibilidadeConfig = {
  fonteGrande: false,
  altoContraste: false,
  modoSimples: false,
  leituraEmVoz: true,
};

function carregar(): AcessibilidadeConfig {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return PADRAO;
    return { ...PADRAO, ...JSON.parse(bruto) };
  } catch {
    return PADRAO;
  }
}

type Contexto = {
  config: AcessibilidadeConfig;
  alternar: (chave: keyof AcessibilidadeConfig) => void;
};

const Ctx = createContext<Contexto>({ config: PADRAO, alternar: () => {} });

export function ProvedorAcessibilidade({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AcessibilidadeConfig>(carregar);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(config));
    } catch {
      /* armazenamento indisponível: segue sem persistir */
    }
    document.body.classList.toggle('fonte-grande', config.fonteGrande);
    document.body.classList.toggle('alto-contraste', config.altoContraste);
    document.body.classList.toggle('modo-simples', config.modoSimples);
  }, [config]);

  // Cancela a fala ao desligar a leitura em voz alta.
  useEffect(() => {
    if (!config.leituraEmVoz) silenciar();
  }, [config.leituraEmVoz]);

  // Cancela a fala no unmount do Provedor.
  useEffect(() => {
    return () => silenciar();
  }, []);

  const valor = useMemo<Contexto>(
    () => ({
      config,
      alternar: (chave) => setConfig((c) => ({ ...c, [chave]: !c[chave] })),
    }),
    [config],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useAcessibilidade() {
  return useContext(Ctx);
}

import { provedorAtivo } from '../lib/voz';

/** Fala um texto em pt-BR via provedor de voz ativo (padrão: Web Speech on-device). */
export function falar(texto: string, habilitado: boolean) {
  provedorAtivo().falar({ texto, habilitado });
}

/** Interrompe qualquer fala em andamento. */
export function silenciar() {
  provedorAtivo().silenciar();
}
