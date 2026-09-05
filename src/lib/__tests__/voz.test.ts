import { describe, expect, it } from 'vitest';
import {
  PROVEDORES,
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
    expect(provedorOpenAIRealtime.motivoIndisponivel?.()).toContain('WebRTC');
  });

  it('provedorAtivo sempre devolve um provedor da lista (fallback seguro)', () => {
    expect(PROVEDORES.length).toBe(3);
    expect(PROVEDORES.map((p) => p.id)).toContain(provedorAtivo().id);
  });
});
