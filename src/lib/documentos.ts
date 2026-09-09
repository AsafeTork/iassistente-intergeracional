/**
 * Documentos: máscara e validação local (nada sai do aparelho — RNF03).
 * Só dígitos contam; a máscara é puramente visual no campo.
 */

/** Só dígitos. */
export function soDigitos(texto: string): string {
  return (texto ?? '').replace(/\D/g, '');
}

/** Máscara CPF 000.000.000-00 aplicada sobre os dígitos (máx 11). */
export function mascararCPF(texto: string): string {
  const d = soDigitos(texto).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** CPF válido na demo = 11 dígitos (sem validação de dígito verificador). */
export function cpfValido(texto: string): boolean {
  return soDigitos(texto).length === 11;
}

/** Código SMS válido na demo = 6 dígitos (ignora espaços). */
export function codigoValido(texto: string): boolean {
  return soDigitos(texto).length === 6;
}

/** Senha válida na demo = 4+ caracteres (não valida força real). */
export function senhaValida(texto: string): boolean {
  return (texto ?? '').length >= 4;
}
