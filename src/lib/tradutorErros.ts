/**
 * Tradutor de erros técnicos → linguagem acolhedora (RF02 do PDF).
 * Regras determinísticas e testáveis; o LLM na nuvem refina o tom,
 * mas o fallback local garante acolhimento mesmo offline.
 */

import { PASSOS_GOVBR } from '../data/mock';

const FALLBACK =
  'Algo não saiu como esperado, e tudo bem. Vamos tentar de novo juntos, sem pressa.';

const DICAS_POR_PASSO: Record<string, string> = {
  cpf: 'Confira se o CPF tem 11 números, só números.',
  senha: 'Senha é letra maiúscula, minúscula e número — confira o cadeado do teclado.',
  codigo: 'O código de 6 números chega por SMS e vale por poucos minutos.',
};

/** Normaliza erro técnico (código entre colchetes, caixa, espaços). */
export function normalizarErro(erroTecnico: string): string {
  return erroTecnico.trim().replace(/\s+/g, ' ').toLowerCase();
}

/** Devolve a mensagem acolhedora para um erro técnico + id do passo. */
export function traduzirErro(erroTecnico: string, passoId: string): string {
  const passo = PASSOS_GOVBR.find((p) => p.id === passoId);
  const dica = DICAS_POR_PASSO[passoId] ? ` ${DICAS_POR_PASSO[passoId]}` : '';
  if (passo?.erroTecnico && normalizarErro(passo.erroTecnico) === normalizarErro(erroTecnico)) {
    return `${passo.erroAmigavel ?? FALLBACK}${dica}`;
  }
  // Correspondência parcial: contém o núcleo do erro conhecido.
  for (const p of PASSOS_GOVBR) {
    if (!p.erroTecnico || !p.erroAmigavel) continue;
    const nucleo = normalizarErro(p.erroTecnico).replace(/^(erro|error)\s*\d*\s*:?\s*/, '');
    if (nucleo.length > 8 && normalizarErro(erroTecnico).includes(nucleo)) {
      return `${p.erroAmigavel}${dica}`;
    }
  }
  return `${FALLBACK}${dica}`;
}

/** Todos os passos do fluxo canônico (sem o passo redundante 'abrir'). */
export function passosCanonicos() {
  return PASSOS_GOVBR.map((p) => p.id);
}
