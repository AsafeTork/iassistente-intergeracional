import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PASSOS_GOVBR } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';
import { PhoneEmulator3D } from '../components/PhoneEmulator3D';
import { PhoneScreen } from '../components/PhoneScreen';

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
  const [concluidos, setConcluidos] = useState<string[]>(lerProgresso);
  const [mostrarErro, setMostrarErro] = useState(false);

  const passo = PASSOS_GOVBR[indice];
  const ultimo = indice === PASSOS_GOVBR.length - 1;
  const progresso = useMemo(
    () => Math.round(((indice + 1) / PASSOS_GOVBR.length) * 100),
    [indice],
  );

  function anunciar(texto: string) {
    falar(texto, config.leituraEmVoz);
  }

  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Demonstração guiada (simulação do login Gov.br)
      </p>
      <h1>Entrar no Gov.br com ajuda do assistente</h1>
      <p className="subtitulo">
        Interaja com o celular 3D abaixo — clique nos campos e botões como se fosse um celular real.
        O assistente guia cada passo com voz e destaque visual.
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
            <button type="button" onClick={() => { setIndice(i); setMostrarErro(false); }}>
              {i < indice ? '✓ ' : ''}{p.titulo}
            </button>
          </li>
        ))}
      </ol>

      <div className="demo-3d-area">
        <section className="painel-assistente" aria-live="polite" aria-label="Assistente">
          <p className="etiqueta">🤖 Assistente diz:</p>
          <p className="fala-grande">"{passo.instrucaoAmigavel}"</p>
          <p className="detalhe">{passo.detalhe}</p>
          <div className="acoes-linha">
            <button type="button" className="botao botao-secundario" onClick={() => anunciar(`${passo.titulo}. ${passo.instrucaoAmigavel}`)}>
              🔊 Ouvir de novo
            </button>
            {passo.erroAmigavel && (
              <button type="button" className="botao botao-aviso" onClick={() => { setMostrarErro(true); if (passo.erroAmigavel) anunciar(passo.erroAmigavel); }}>
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

        <section className="painel-tela-3d" aria-label="Emulador 3D do portal">
          <PhoneEmulator3D titulo="Celular 3D — toque para interagir">
            <PhoneScreen
              indice={indice}
              setIndice={setIndice}
              concluidos={concluidos}
              setConcluidos={setConcluidos}
              onAvancar={() => setMostrarErro(false)}
              onErro={() => setMostrarErro(true)}
            />
          </PhoneEmulator3D>
          <p className="privacidade-nota">🔒 Filtro de privacidade ativo: senhas e CPF ficam só neste aparelho (simulação).</p>
        </section>
      </div>

      {ultimo && concluidos.includes('pronto') && (
        <section className="selo-sucesso" aria-label="Conquista">
          <h2>🏅 Selo "Primeiro acesso sozinho" desbloqueado!</h2>
          <p>Progresso salvo neste navegador. No app real, seu tutor jovem seria avisado para comemorar com você.</p>
          <Link to="/tutoria" className="botao botao-primario botao-grande">
            Pedir acompanhamento de um tutor
          </Link>
        </section>
      )}
    </div>
  );
}
