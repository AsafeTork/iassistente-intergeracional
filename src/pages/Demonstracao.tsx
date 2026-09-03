import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PASSOS_GOVBR } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';

const CHAVE_PROGRESSO = 'iassistente:progresso:v1';

function lerProgresso(): string[] {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_PROGRESSO) ?? '[]');
  } catch {
    return [];
  }
}

export function Demonstracao() {
  const { config } = useAcessibilidade();
  const [indice, setIndice] = useState(0);
  const [valor, setValor] = useState('');
  const [mostrarErro, setMostrarErro] = useState(false);
  const [concluidos, setConcluidos] = useState<string[]>(lerProgresso);

  const passo = PASSOS_GOVBR[indice];
  const ultimo = indice === PASSOS_GOVBR.length - 1;
  const progresso = useMemo(
    () => Math.round(((indice + 1) / PASSOS_GOVBR.length) * 100),
    [indice],
  );

  function anunciar(texto: string) {
    falar(texto, config.leituraEmVoz);
  }

  function avancar() {
    setMostrarErro(false);
    const novos = Array.from(new Set([...concluidos, passo.id]));
    setConcluidos(novos);
    try {
      localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(novos));
    } catch {
      /* sem persistência */
    }
    if (!ultimo) {
      const proximo = PASSOS_GOVBR[indice + 1];
      setIndice(indice + 1);
      setValor('');
      anunciar(`${proximo.titulo}. ${proximo.instrucaoAmigavel}`);
    } else {
      anunciar('Demonstração concluída. Parabéns!');
    }
  }

  function voltar() {
    if (indice === 0) return;
    setMostrarErro(false);
    setValor('');
    setIndice(indice - 1);
  }

  function simularErro() {
    setMostrarErro(true);
    if (passo.erroAmigavel) anunciar(passo.erroAmigavel);
  }

  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Demonstração guiada (simulação do login Gov.br)
      </p>
      <h1>Entrar no Gov.br com ajuda do assistente</h1>
      <p className="subtitulo">
        Simulação fiel ao mockup do projeto: campo com <strong>borda amarela</strong>, instrução em voz
        e tradução de erros. Nenhum dado é enviado — tudo fictício e local.
      </p>

      <div
        className="barra-progresso"
        role="progressbar"
        aria-valuenow={progresso}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da demonstração"
      >
        <div className="barra-progresso-preenchimento" style={{ width: `${progresso}%` }} />
        <span className="barra-progresso-texto">
          Passo {indice + 1} de {PASSOS_GOVBR.length} • {progresso}%
        </span>
      </div>

      <ol className="trilha" aria-label="Etapas">
        {PASSOS_GOVBR.map((p, i) => (
          <li key={p.id} className={i === indice ? 'trilha-item atual' : i < indice ? 'trilha-item feito' : 'trilha-item'}>
            <button type="button" onClick={() => { setIndice(i); setValor(''); setMostrarErro(false); }}>
              {i < indice ? '✓ ' : ''}{p.titulo}
            </button>
          </li>
        ))}
      </ol>

      <div className="demo-grade">
        <section className="painel-assistente" aria-live="polite" aria-label="Assistente">
          <p className="etiqueta">🤖 Assistente diz:</p>
          <p className="fala-grande">“{passo.instrucaoAmigavel}”</p>
          <p className="detalhe">{passo.detalhe}</p>
          <div className="acoes-linha">
            <button type="button" className="botao botao-secundario" onClick={() => anunciar(`${passo.titulo}. ${passo.instrucaoAmigavel}`)}>
              🔊 Ouvir de novo
            </button>
            {passo.erroAmigavel && !mostrarErro && (
              <button type="button" className="botao botao-aviso" onClick={simularErro}>
                Simular erro do portal
              </button>
            )}
          </div>

          {mostrarErro && passo.erroTecnico && (
            <div className="erro-demo">
              <p>
                <strong>Portal diz (difícil):</strong> <code>{passo.erroTecnico}</code>
              </p>
              <p className="erro-traducao">
                <strong>Assistente traduz (acolhedor):</strong> {passo.erroAmigavel}
              </p>
            </div>
          )}
        </section>

        <section className="painel-tela" aria-label="Tela simulada do portal">
          <div className="celular grande">
            <p className="celular-topo">ENTRAR COM GOV.BR</p>
            {passo.campo ? (
              <div className="celular-campo-destaque">
                <label htmlFor="campo-demo">{passo.campo.rotulo}</label>
                <input
                  id="campo-demo"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder={passo.campo.exemplo}
                  inputMode={passo.campo.tipo === 'texto' ? 'text' : 'numeric'}
                  type={passo.campo.tipo === 'senha' ? 'password' : 'text'}
                  autoComplete="off"
                />
                <small>Exemplo fictício — nada é enviado.</small>
              </div>
            ) : (
              <p className="celular-info">{ultimo ? '🎉 Conta aberta com sucesso!' : 'Toque em continuar para o próximo passo.'}</p>
            )}
            <div className="celular-botoes">
              <button type="button" className="celular-botao-sec" onClick={voltar} disabled={indice === 0}>
                ← Voltar
              </button>
              <button type="button" className="celular-botao" onClick={avancar}>
                {ultimo ? 'Concluir 🎉' : 'Continuar →'}
              </button>
            </div>
          </div>
          <p className="privacidade-nota">🔒 Filtro de privacidade ativo: senhas e CPF ficam só neste aparelho (simulação).</p>
        </section>
      </div>

      {ultimo && concluidos.includes('pronto') && (
        <section className="selo-sucesso" aria-label="Conquista">
          <h2>🏅 Selo “Primeiro acesso sozinho” desbloqueado!</h2>
          <p>Progresso salvo neste navegador. No app real, seu tutor jovem seria avisado para comemorar com você.</p>
          <Link to="/tutoria" className="botao botao-primario botao-grande">
            Pedir acompanhamento de um tutor
          </Link>
        </section>
      )}
    </div>
  );
}
