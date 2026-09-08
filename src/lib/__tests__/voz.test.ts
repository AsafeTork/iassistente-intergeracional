import { describe, expect, it, vi } from 'vitest';
import {
  PAUSA_ENTRE_FRASES_MS,
  PROVEDORES,
  VELOCIDADE_PADRAO_IDOSO,
  dividirEmFrases,
  provedorAtivo,
  provedorOpenAIRealtime,
  provedorOpenAITTS,
  provedorWebSpeech,
} from '../voz';

describe('camada de voz (RF03)', () => {
  it('web-speech nunca lança, com ou sem speechSynthesis', () => {
    expect(() => provedorWebSpeech.falar({ texto: 'oi', habilitado: true })).not.toThrow();
    expect(() => provedorWebSpeech.falar({ texto: 'oi', habilitado: false })).not.toThrow();
    expect(() => provedorWebSpeech.silenciar()).not.toThrow();
  });

  it('provedores OpenAI desligados sem backend, com motivo', () => {
    expect(provedorOpenAITTS.disponivel()).toBe(false);
    expect(provedorOpenAITTS.motivoIndisponivel?.()).toContain('OPENAI_API_KEY');
    expect(provedorOpenAIRealtime.disponivel()).toBe(false);
    expect(provedorOpenAIRealtime.motivoIndisponivel?.()).toContain('backend');
  });

  it('provedorAtivo sempre devolve um provedor da lista (fallback seguro)', () => {
    expect(PROVEDORES.length).toBe(3);
    expect(PROVEDORES.map((p) => p.id)).toContain(provedorAtivo().id);
  });

  it('ritmo idoso: rate padrão 0.8 (≈132 WPM) e pausa de 600ms entre frases', () => {
    expect(VELOCIDADE_PADRAO_IDOSO).toBe(0.8);
    expect(PAUSA_ENTRE_FRASES_MS).toBe(600);
    expect(dividirEmFrases('Olá. Como vai? Bem!')).toEqual(['Olá.', 'Como vai?', 'Bem!']);
    expect(dividirEmFrases('sem pontuação')).toEqual(['sem pontuação']);
  });

  it('fala cada frase com rate 0.8 e agenda pausa via setTimeout', () => {
    vi.useFakeTimers();
    try {
      const falas: { text: string; rate: number }[] = [];
      const speak = vi.fn((u: { text: string; rate: number }) => {
        falas.push({ text: u.text, rate: u.rate });
      });
      vi.stubGlobal('SpeechSynthesisUtterance', class {
        text: string;
        rate = 1;
        lang = '';
        pitch = 1;
        volume = 1;
        voice: unknown = null;
        constructor(t: string) {
          this.text = t;
        }
      });
      vi.stubGlobal('window', {
        speechSynthesis: { cancel: vi.fn(), speak, getVoices: () => [] },
        setTimeout: (fn: () => void, ms?: number) => globalThis.setTimeout(fn, ms),
      });
      provedorWebSpeech.falar({ texto: 'Olá. Tudo bem?', habilitado: true });
      expect(falas).toHaveLength(0);
      vi.advanceTimersByTime(0);
      expect(falas).toHaveLength(1);
      expect(falas[0].rate).toBe(0.8);
      vi.advanceTimersByTime(PAUSA_ENTRE_FRASES_MS);
      expect(falas).toHaveLength(2);
      expect(falas[1].rate).toBe(0.8);
    } finally {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });
});
