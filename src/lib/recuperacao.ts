/**
 * Recuperação na hora (RAG sem nada decorado) — RF01/RF04.
 *
 * A IA do app NÃO tem nada decorado: recupera na hora da web.
 * Ordem: DuckDuckGo Instant Answer (AbstractText) → Wikipedia pt (extract)
 * → fallback curado local (offline).
 *
 * - DDG e Wikipedia pt têm `Access-Control-Allow-Origin: *` (CORS aberto).
 * - CKAN dados.gov.br NÃO tem CORS → fica para backend futuro (só documentado).
 * - Cache em localStorage (TTL 7 dias), timeout 8s/fonte, tudo em try/catch.
 */

export type FonteAjuda = 'duckduckgo' | 'wikipedia' | 'local';

export type ResultadoAjuda = {
  fonte: FonteAjuda;
  texto: string;
};

export const CACHE_KEY = 'iassistente:rag:v1';
export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias
export const TIMEOUT_POR_FONTE_MS = 8000;

type EntradaCache = { fonte: FonteAjuda; texto: string; ts: number };
type MapaCache = Record<string, EntradaCache>;

/**
 * Fallback curado local (1 frase cada) — usado offline ou quando a web falha.
 * CKAN dados.gov.br: sem CORS no navegador → rota de backend futuro, não aqui.
 */
const CONHECIMENTO_LOCAL: Array<{ chaves: string[]; texto: string }> = [
  {
    chaves: ['gov.br', 'govbr', 'conta gov'],
    texto: 'A conta gov.br é a sua identidade no governo: entre em gov.br com CPF e senha para acessar os serviços.',
  },
  {
    chaves: ['cpf'],
    texto: 'O CPF tem 11 números, só números, sem ponto nem traço na hora de digitar.',
  },
  {
    chaves: ['senha'],
    texto: 'A senha da conta gov.br é pessoal: digite com calma e confira as letras maiúsculas e minúsculas.',
  },
  {
    chaves: ['inss', 'aposentadoria', 'benefício', 'beneficio'],
    texto: 'Os serviços do INSS, como extrato e aposentadoria, ficam dentro do portal Meu INSS com a conta gov.br.',
  },
  {
    chaves: ['sus', 'saude', 'saúde', 'ubs', 'cartão sus', 'cartao sus'],
    texto: 'O cartão SUS tem 15 números e é pedido nas UBS e postos de saúde para marcar consultas.',
  },
];

const FALLBACK_GENERICO =
  'Não encontrei na internet agora, mas fique tranquilo: me diga o que aparece na tela que eu ajudo passo a passo.';

/** Normaliza o termo para chave de cache e comparação. */
export function normalizarTermo(termo: string): string {
  return termo.trim().toLowerCase();
}

/** Resposta curada local (síncrona, nunca falha). */
export function ajudaLocal(termo: string): ResultadoAjuda {
  const t = normalizarTermo(termo);
  for (const item of CONHECIMENTO_LOCAL) {
    if (item.chaves.some((c) => t.includes(c))) {
      return { fonte: 'local', texto: item.texto };
    }
  }
  return { fonte: 'local', texto: FALLBACK_GENERICO };
}

function lerCache(): MapaCache {
  try {
    if (typeof localStorage === 'undefined') return {};
    const bruto = localStorage.getItem(CACHE_KEY);
    if (!bruto) return {};
    const parsed = JSON.parse(bruto) as MapaCache;
    if (typeof parsed !== 'object' || parsed === null) return {};
    return parsed;
  } catch {
    return {};
  }
}

function lerDoCache(termo: string, agora = Date.now()): ResultadoAjuda | null {
  try {
    const mapa = lerCache();
    const entrada = mapa[normalizarTermo(termo)];
    if (!entrada || typeof entrada.texto !== 'string') return null;
    if (agora - entrada.ts > CACHE_TTL_MS) return null; // expirado
    if (entrada.fonte !== 'duckduckgo' && entrada.fonte !== 'wikipedia' && entrada.fonte !== 'local') {
      return null;
    }
    return { fonte: entrada.fonte, texto: entrada.texto };
  } catch {
    return null;
  }
}

function salvarNoCache(termo: string, r: ResultadoAjuda): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const mapa = lerCache();
    mapa[normalizarTermo(termo)] = { ...r, ts: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(mapa));
  } catch {
    /* cache indisponível (modo privado): segue sem cache */
  }
}

/** Limpa o cache (útil em testes e no botão "limpar dados"). */
export function limparCacheRecuperacao(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

async function fetchComTimeout(url: string, timeoutMs = TIMEOUT_POR_FONTE_MS): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function tentarDDG(termo: string): Promise<string | null> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(termo)}&format=json&lang=pt-br`;
  const res = await fetchComTimeout(url);
  if (!res.ok) return null;
  const json = (await res.json()) as { AbstractText?: string };
  const texto = (json.AbstractText ?? '').trim();
  return texto ? texto : null;
}

type WikiResponse = {
  query?: { pages?: Record<string, { extract?: string; missing?: boolean }> };
};

async function tentarWikipedia(termo: string): Promise<string | null> {
  const url =
    `https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext` +
    `&titles=${encodeURIComponent(termo)}&format=json&origin=*`;
  const res = await fetchComTimeout(url);
  if (!res.ok) return null;
  const json = (await res.json()) as WikiResponse;
  const pages = json.query?.pages;
  if (!pages) return null;
  for (const id of Object.keys(pages)) {
    const p = pages[id];
    if (p.missing) continue;
    const texto = (p.extract ?? '').trim();
    if (texto) return texto;
  }
  return null;
}

/**
 * Busca ajuda na hora: DDG → Wikipedia → local.
 * Nunca lança: em qualquer falha devolve o fallback curado local.
 */
export async function buscarAjuda(termo: string): Promise<ResultadoAjuda> {
  const t = (termo ?? '').trim();
  if (!t) return ajudaLocal('');
  try {
    const hit = lerDoCache(t);
    if (hit) return hit;
  } catch {
    /* segue para a rede */
  }
  try {
    const ddg = await tentarDDG(t);
    if (ddg) {
      const r: ResultadoAjuda = { fonte: 'duckduckgo', texto: ddg };
      salvarNoCache(t, r);
      return r;
    }
  } catch {
    /* cai para a próxima fonte */
  }
  try {
    const wiki = await tentarWikipedia(t);
    if (wiki) {
      const r: ResultadoAjuda = { fonte: 'wikipedia', texto: wiki };
      salvarNoCache(t, r);
      return r;
    }
  } catch {
    /* cai para o fallback local */
  }
  const local = ajudaLocal(t);
  try {
    salvarNoCache(t, local);
  } catch {
    /* ignore */
  }
  return local;
}
