import { describe, expect, it } from 'vitest';
import { codigoValido, cpfValido, mascararCPF, senhaValida, soDigitos } from '../documentos';

describe('documentos (máscara/validação local)', () => {
  it('extrai só dígitos', () => {
    expect(soDigitos('123.456.789-00')).toBe('12345678900');
  });

  it('mascara CPF progressivo', () => {
    expect(mascararCPF('123')).toBe('123');
    expect(mascararCPF('123456')).toBe('123.456');
    expect(mascararCPF('12345678900')).toBe('123.456.789-00');
    expect(mascararCPF('12345678900999')).toBe('123.456.789-00');
  });

  it('valida CPF com 11 dígitos', () => {
    expect(cpfValido('123.456.789-00')).toBe(true);
    expect(cpfValido('12345678900')).toBe(true);
    expect(cpfValido('123')).toBe(false);
    expect(cpfValido('')).toBe(false);
  });

  it('valida código SMS com 6 dígitos', () => {
    expect(codigoValido('482 916')).toBe(true);
    expect(codigoValido('48291')).toBe(false);
  });

  it('valida senha mínima da demo', () => {
    expect(senhaValida('teste123')).toBe(true);
    expect(senhaValida('abc')).toBe(false);
  });
});
