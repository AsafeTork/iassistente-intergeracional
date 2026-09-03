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

/** Fala um texto em pt-BR usando a síntese de voz do dispositivo (quando disponível). */
export function falar(texto: string, habilitado: boolean) {
  if (!habilitado) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'pt-BR';
    voz.rate = 0.95;
    window.speechSynthesis.speak(voz);
  } catch {
    /* voz indisponível: segue só com o texto visual */
  }
}
