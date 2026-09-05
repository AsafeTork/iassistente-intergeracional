// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { MASCARA, NUNCA_SAI, PODE_SAIR, higienizarDOM } from '../filtroPrivacidade';

const parser = () => new window.DOMParser();

describe('higienizarDOM (RNF03)', () => {
  it('mascara input de senha e marca como higienizado', () => {
    const r = higienizarDOM('<input type="password" value="segredo123" /><button>Entrar</button>', parser());
    expect(r.higienizado).toContain(MASCARA);
    expect(r.higienizado).not.toContain('segredo123');
    expect(r.higienizado).toContain('<button>Entrar</button>');
    expect(r.categorias).toContain('senha');
  });

  it('mascara campo CPF por nome', () => {
    const r = higienizarDOM('<input name="cpf" value="123.456.789-00" />', parser());
    expect(r.higienizado).not.toContain('123.456.789-00');
    expect(r.categorias).toContain('cpf');
  });

  it('mascara código 2FA e autocomplete one-time-code', () => {
    const r = higienizarDOM('<input name="codigo" value="482916" /><input autocomplete="one-time-code" value="111222" />', parser());
    expect(r.higienizado).not.toContain('482916');
    expect(r.higienizado).not.toContain('111222');
    expect(r.removidos).toBeGreaterThanOrEqual(2);
  });

  it('mascara CPF e código soltos em texto', () => {
    const r = higienizarDOM('<p>Seu CPF 12345678900 e o código 482916 chegaram</p>', parser());
    expect(r.higienizado).not.toContain('12345678900');
    expect(r.higienizado).not.toContain('482916');
  });

  it('preserva estrutura não sensível e conta remoções', () => {
    const r = higienizarDOM('<h1>Gov.br</h1><input name="cpf" value="1" /><input type="password" value="2" />', parser());
    expect(r.higienizado).toContain('Gov.br');
    expect(r.removidos).toBe(2);
  });

  it('contrato RNF03 formal: nada sensível sai, estrutura sai', () => {
    expect(NUNCA_SAI).toContain('senhas');
    expect(PODE_SAIR.join(' ')).toContain('estrutura');
  });
});
