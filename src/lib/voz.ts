/**
 * Camada de voz plugável (RF03) — pesquisa OpenAI 2026 incorporada.
 *
 * Achados:
 * - O "sistema de fala novo" do app da OpenAI é a Realtime API
 *   (modelo gpt-realtime-2.1, voz "marin") via WebRTC, igual ao modo
 *   de voz avançado do ChatGPT: fala↔fala em baixa latência.
 * - Porém ela EXIGE backend (tokens efêmeros via /v1/realtime/client_secrets
 *   ou sessão via /v1/realtime/calls, chave NUNCA no navegador).
 * - O caminho simples é o REST gpt-4o-mini-tts (13 vozes, `instructions`
 *   controla tom/sotaque/velocidade, streaming) — também via proxy backend.
 * - Nosso app é 100% estático + RNF03 (nada sai do aparelho) + opera offline
 *   em UBS: voz em nuvem quebraria os três pilares. Por isso a arquitetura é
 *   em camadas: Web Speech API (grátis, on-device, offline) como padrão,
 *   provedor OpenAI plugável para a fase com backend, e Piper TTS local
 *   como rota offline futura (pt-BR, grátis, roda no aparelho).
 */

export type ProvedorVozId = 'web-speech' | 'openai-tts' | 'openai-realtime' | 'piper-local';

export type FalaOpcoes = {
  texto: string;
  habilitado: boolean;
  /** Tom em linguagem simples; o provedor OpenAI vira `instructions`. */
  tom?: string;
  velocidade?: number;
};

export type ProvedorVoz = {
  id: ProvedorVozId;
  /** false = indisponível neste ambiente (ex.: sem backend configurado). */
  disponivel: () => boolean;
  falar: (op: FalaOpcoes) => void;
  silenciar: () => void;
  motivoIndisponivel?: () => string;
};

function temWebSpeech(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let vozPtBR: SpeechSynthesisVoice | null | undefined;
function escolherVozPtBR(): SpeechSynthesisVoice | null {
  if (!temWebSpeech()) return null;
  if (vozPtBR !== undefined) return vozPtBR;
  const vozes = window.speechSynthesis.getVoices();
  vozPtBR =
    vozes.find((v) => v.lang.toLowerCase().startsWith('pt-br')) ??
    vozes.find((v) => v.lang.toLowerCase().startsWith('pt')) ??
    null;
  return vozPtBR;
}

if (temWebSpeech()) {
  try {
    escolherVozPtBR();
    window.speechSynthesis.onvoiceschanged = () => {
      vozPtBR = undefined;
      escolherVozPtBR();
    };
  } catch {
    /* voz indisponível: segue só com o texto visual */
  }
}

export const provedorWebSpeech: ProvedorVoz = {
  id: 'web-speech',
  disponivel: () => temWebSpeech(),
  falar: ({ texto, habilitado, velocidade = 0.95 }) => {
    if (!habilitado || !temWebSpeech()) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const msg = new SpeechSynthesisUtterance(texto);
      msg.lang = 'pt-BR';
      msg.rate = velocidade;
      msg.pitch = 1.0;
      msg.volume = 1.0;
      const voz = escolherVozPtBR();
      if (voz) {
        msg.voice = voz;
        msg.lang = voz.lang;
      }
      synth.speak(msg);
    } catch {
      /* voz indisponível: segue só com o texto visual */
    }
  },
  silenciar: () => {
    try {
      if (temWebSpeech()) window.speechSynthesis.cancel();
    } catch {
      /* nada a cancelar */
    }
  },
};

/**
 * Stub do provedor OpenAI TTS (fase com backend).
 * Contrato: POST /api/voz {input, instructions} → áudio; a chave OpenAI
 * vive SÓ no servidor (proxy), nunca no bundle. `instructions` carrega o
 * tom acolhedor + "sotaque brasileiro, ritmo lento para idosos".
 */
export const provedorOpenAITTS: ProvedorVoz = {
  id: 'openai-tts',
  disponivel: () => false,
  falar: () => {},
  silenciar: () => {},
  motivoIndisponivel: () =>
    'Requer backend com OPENAI_API_KEY (proxy /api/voz → gpt-4o-mini-tts). App ainda 100% estático (RNF03).',
};

/**
 * Stub da Realtime API (modo de voz do app da OpenAI, gpt-realtime-2.1).
 * Contrato: GET /api/voz/sessao (token efêmero) → WebRTC peer connection.
 */
export const provedorOpenAIRealtime: ProvedorVoz = {
  id: 'openai-realtime',
  disponivel: () => false,
  falar: () => {},
  silenciar: () => {},
  motivoIndisponivel: () =>
    'Requer backend (sessão /v1/realtime/calls ou token /v1/realtime/client_secrets) + microfone. Rota pós-estática.',
};

export const PROVEDORES: ProvedorVoz[] = [provedorWebSpeech, provedorOpenAITTS, provedorOpenAIRealtime];

/** Devolve o primeiro provedor disponível (hoje: sempre web-speech). */
export function provedorAtivo(): ProvedorVoz {
  return PROVEDORES.find((p) => p.disponivel()) ?? provedorWebSpeech;
}
