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

/** Voz pt-BR em cache (getVoices é assíncrono em alguns navegadores). */
let vozPtBR: SpeechSynthesisVoice | null = null;

function escolherVozPtBR(): SpeechSynthesisVoice | null {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes.length) return null;
    return (
      vozes.find((v) => v.lang.toLowerCase().startsWith('pt-br')) ??
      vozes.find((v) => v.lang.toLowerCase().startsWith('pt')) ??
      null
    );
  } catch {
    return null;
  }
}

try {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    vozPtBR = escolherVozPtBR();
    // As vozes podem carregar depois da primeira chamada: atualiza o cache quando chegarem.
    window.speechSynthesis.onvoiceschanged = () => {
      vozPtBR = escolherVozPtBR();
    };
  }
} catch {
  /* voz indisponível: segue só com o texto visual */
}

/** Interrompe qualquer fala em andamento. */
export function silenciar() {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    /* voz indisponível: nada a cancelar */
  }
}

/** Fala um texto em pt-BR usando a síntese de voz do dispositivo (quando disponível). */
export function falar(texto: string, habilitado: boolean) {
  if (!habilitado) return;
  try {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(texto);
    msg.lang = 'pt-BR';
    msg.rate = 0.95;
    msg.pitch = 1.0;
    msg.volume = 1.0;
    const voz = vozPtBR ?? escolherVozPtBR();
    if (voz) {
      msg.voice = voz;
      msg.lang = voz.lang;
    }
    window.speechSynthesis.speak(msg);
  } catch {
    /* voz indisponível: segue só com o texto visual */
  }
}
