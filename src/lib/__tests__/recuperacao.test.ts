// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CACHE_KEY,
  CACHE_TTL_MS,
  buscarAjuda,
  limparCacheRecuperacao,
} from '../recuperacao';

function mockFetch(impl: (url: string) => unknown) {
  return vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => impl(url)),
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  limparCacheRecuperacao();
});

describe('recuperacao (buscarAjuda)', () => {
  it('DDG ok devolve fonte duckduckgo', async () => {
    mockFetch(() => ({
      ok: true,
      json: async () => ({ AbstractText: 'Conta gov.br é a identidade do cidadão.' }),
    }));
    const r = await buscarAjuda('gov.br');
    expect(r.fonte).toBe('duckduckgo');
    expect(r.texto).toContain('gov.br');
  });

  it('DDG vazio cai para Wikipedia', async () => {
    mockFetch((url: string) => {
      if (url.includes('duckduckgo')) {
        return { ok: true, json: async () => ({ AbstractText: '   ' }) };
      }
      return {
        ok: true,
        json: async () => ({ query: { pages: { 123: { extract: 'SUS é o sistema de saúde.' } } } }),
      };
    });
    const r = await buscarAjuda('SUS');
    expect(r.fonte).toBe('wikipedia');
    expect(r.texto).toContain('SUS');
  });

  it('tudo falha (offline) devolve fallback local curado', async () => {
    mockFetch(() => {
      throw new Error('offline');
    });
    const r = await buscarAjuda('CPF');
    expect(r.fonte).toBe('local');
    expect(r.texto).toContain('11 números');
  });

  it('usa cache dentro do TTL sem chamar fetch', async () => {
    mockFetch(() => ({
      ok: true,
      json: async () => ({ AbstractText: 'Texto da rede.' }),
    }));
    const primeira = await buscarAjuda('INSS');
    expect(primeira.fonte).toBe('duckduckgo');

    const spy = vi.fn(async () => {
      throw new Error('não deveria chamar rede');
    });
    vi.stubGlobal('fetch', spy);
    const segunda = await buscarAjuda('INSS');
    expect(segunda).toEqual(primeira);
    expect(spy).not.toHaveBeenCalled();
  });

  it('cache expirado (>7 dias) volta para a rede', async () => {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        inss: { fonte: 'duckduckgo', texto: 'velho', ts: Date.now() - CACHE_TTL_MS - 1000 },
      }),
    );
    mockFetch(() => ({
      ok: true,
      json: async () => ({ AbstractText: 'Texto novo da rede.' }),
    }));
    const r = await buscarAjuda('INSS');
    expect(r.fonte).toBe('duckduckgo');
    expect(r.texto).toBe('Texto novo da rede.');
  });
});
