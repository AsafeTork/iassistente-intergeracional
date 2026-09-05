import { describe, expect, it } from 'vitest';
import { normalizarErro, passosCanonicos, traduzirErro } from '../tradutorErros';

describe('tradutorErros (RF02)', () => {
  it('traduz erro 400 de CPF com acolhimento + dica', () => {
    const msg = traduzirErro('Erro 400: documento inválido.', 'cpf');
    expect(msg).toContain('sem pressa');
    expect(msg).toContain('11 números');
  });

  it('é insensível a caixa e espaços', () => {
    expect(normalizarErro('  ERRO   400: Documento Inválido. ')).toBe('erro 400: documento inválido.');
  });

  it('traduz senha e código com tom acolhedor', () => {
    expect(traduzirErro('Credenciais inválidas. Tentativas restantes: 2.', 'senha')).toContain('calma');
    expect(traduzirErro('Token expirado. Solicite novo código.', 'codigo')).toContain('outro código');
  });

  it('fallback acolhedor para erro desconhecido', () => {
    const msg = traduzirErro('HTTP 500 explode', 'cpf');
    expect(msg).toContain('tudo bem');
    expect(msg).toContain('11 números');
  });

  it('fluxo canônico tem 4 passos, sem o redundante abrir', () => {
    expect(passosCanonicos()).toEqual(['cpf', 'senha', 'codigo', 'pronto']);
  });
});
