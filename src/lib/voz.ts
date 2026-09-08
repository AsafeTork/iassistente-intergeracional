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

/** Ritmo idoso (pesquisa: 124-145 WPM, não 165): rate 1.0 ≈ 165 WPM → 0.8 ≈ 132 WPM. */
export const VELOCIDADE_PADRAO_IDOSO = 0.8;
/** Pausa entre frases para processamento (idosos). */
export const PAUSA_ENTRE_FRASES_MS = 600;

/** Quebra o texto em frases (mantém pontuação) para agendar pausas. */
export function dividirEmFrases(texto: string): string[] {
  const partes = texto.match(/[^.!?…]+[.!?…]+["”)]?|[^.!?…]+$/g);
  if (!partes) return [texto].map((s) => s.trim()).filter(Boolean);
  return partes.map((s) => s.trim()).filter(Boolean);
}

/** Token que invalida setTimeouts pendentes após falar()/silenciar() (sem preempção). */
let sequenciaFala = 0;

export const provedorWebSpeech: ProvedorVoz = {
  id: 'web-speech',
  disponivel: () => temWebSpeech(),
  falar: ({ texto, habilitado, velocidade = VELOCIDADE_PADRAO_IDOSO }) => {
    if (!habilitado || !temWebSpeech()) return;
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const minhaVez = ++sequenciaFala;
      const frases = dividirEmFrases(texto);
      const voz = escolherVozPtBR();
      frases.forEach((frase, i) => {
        window.setTimeout(() => {
          if (minhaVez !== sequenciaFala || !temWebSpeech()) return;
          const msg = new SpeechSynthesisUtterance(frase);
          msg.lang = 'pt-BR';
          msg.rate = velocidade;
          msg.pitch = 1.0;
          msg.volume = 1.0;
          if (voz) {
            msg.voice = voz;
            msg.lang = voz.lang;
          }
          window.speechSynthesis.speak(msg);
        }, i * PAUSA_ENTRE_FRASES_MS);
      });
    } catch {
      /* voz indisponível: segue só com o texto visual */
    }
  },
  silenciar: () => {
    try {
      sequenciaFala++;
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
