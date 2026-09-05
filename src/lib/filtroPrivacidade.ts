/**
 * Filtro de privacidade local (RNF03) — implementação real da Figura 1 do PDF.
 *
 * Recebe HTML bruto capturado da página ativa e devolve a versão higienizada
 * que pode seguir para a nuvem: senhas, CPF, códigos SMS e dados de saúde
 * são mascarados ANTES de qualquer envio. Roda 100% no aparelho.
 */

export const MASCARA = '[REMOVIDO]';

const SELETORES_SENSIVEIS = [
  'input[type="password"]',
  'input[name*="senha" i]',
  'input[name*="password" i]',
  'input[name*="cpf" i]',
  'input[name*="token" i]',
  'input[name*="codigo" i]',
  'input[name*="código" i]',
  'input[name*="sms" i]',
  'input[name*="saude" i]',
  'input[name*="saúde" i]',
  'input[name*="sus" i]',
  'input[autocomplete="current-password"]',
  'input[autocomplete="new-password"]',
  'input[autocomplete="one-time-code"]',
  '[data-sensivel="true"]',
];

const PADRAO_CPF = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g;
const PADRAO_CODIGO_6 = /(?<![\d])\d{6}(?![\d])/g;

export type ResultadoFiltro = {
  higienizado: string;
  removidos: number;
  categorias: string[];
};

function categoriaDoCampo(el: Element): string {
  const tipo = (el.getAttribute('type') ?? '').toLowerCase();
  const nome = (el.getAttribute('name') ?? '').toLowerCase();
  const auto = (el.getAttribute('autocomplete') ?? '').toLowerCase();
  if (tipo === 'password' || auto.includes('password')) return 'senha';
  if (nome.includes('cpf')) return 'cpf';
  if (nome.includes('token') || nome.includes('codigo') || nome.includes('código') || auto.includes('one-time-code')) return 'codigo-2fa';
  if (nome.includes('sms')) return 'sms';
  if (nome.includes('saude') || nome.includes('saúde') || nome.includes('sus')) return 'saude';
  return 'dado-sensivel';
}

/**
 * Higieniza um HTML. Usa o DOMParser do ambiente (navegador ou happy-dom nos testes).
 */
export function higienizarDOM(htmlBruto: string, parser?: DOMParser): ResultadoFiltro {
  const dp =
    parser ??
    (typeof window !== 'undefined' && 'DOMParser' in window ? new window.DOMParser() : undefined);
  if (!dp) throw new Error('higienizarDOM precisa de DOMParser (navegador ou ambiente de teste)');
  const doc = dp.parseFromString(htmlBruto, 'text/html');
  const categorias = new Set<string>();
  let removidos = 0;

  for (const seletor of SELETORES_SENSIVEIS) {
    for (const el of Array.from(doc.querySelectorAll(seletor))) {
      const tag = el.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        (el as HTMLInputElement).value = '';
        el.setAttribute('value', MASCARA);
      } else {
        el.textContent = MASCARA;
      }
      el.setAttribute('data-higienizado', 'true');
      categorias.add(categoriaDoCampo(el));
      removidos += 1;
    }
  }

  // Varre textos soltos: CPF e códigos de 6 dígitos fora de campos.
  const walker = doc.createTreeWalker(doc.body, 4 /* SHOW_TEXT */);
  const textos: Text[] = [];
  let no: Node | null = walker.nextNode();
  while (no) {
    textos.push(no as Text);
    no = walker.nextNode();
  }
  for (const t of textos) {
    const original = t.nodeValue ?? '';
    const limpo = original.replace(PADRAO_CPF, MASCARA).replace(PADRAO_CODIGO_6, MASCARA);
    if (limpo !== original) {
      t.nodeValue = limpo;
      removidos += 1;
      if (PADRAO_CPF.test(original)) categorias.add('cpf-texto');
      categorias.add('texto-sensivel');
    }
  }
  PADRAO_CPF.lastIndex = 0;

  return { higienizado: doc.body.innerHTML, removidos, categorias: [...categorias] };
}

/** O que NUNCA sai do aparelho (contrato RNF03 formal em código). */
export const NUNCA_SAI = ['senhas', 'CPF completo', 'dados de saúde', 'códigos SMS/2FA'] as const;

/** O que PODE sair, já higienizado. */
export const PODE_SAIR = [
  'estrutura da tela (layout, posições)',
  'passo atual ("tela 2 de 5")',
  'erros técnicos genéricos sem dados',
] as const;
