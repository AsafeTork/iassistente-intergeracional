import { Link } from 'react-router-dom';
import { BarraAcessibilidade } from '../components/BarraAcessibilidade';
import { MockupFalante } from '../components/MockupFalante';
import { SERVICOS } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function PessoasIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function SetaDirIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="var(--azul)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

export function Home() {
  const { config } = useAcessibilidade();

  return (
    <div>
      <BarraAcessibilidade />

      <section className="destaque">
        <div className="destaque-texto">
          <p className="etiqueta">Protótipo • IFPA Bragança • Código aberto</p>
          <h1>
            O celular explica <span className="realce">passo a passo</span>, com voz calma e letra grande.
          </h1>
          <p className="subtitulo">
            O <strong>IAssistente Intergeracional</strong> ajuda idosos e pessoas com dificuldade visual a
            usar portais como o <strong>Gov.br</strong> sozinhos: destaca onde tocar, traduz palavras
            difíceis e transforma erros assustadores em mensagens acolhedoras.
          </p>
          <div className="acoes">
            <Link
              to="/demonstracao"
              className="botao botao-primario botao-grande"
              onClick={() =>
                falar('Vamos começar a demonstração do login com ajuda passo a passo.', config.leituraEmVoz)
              }
            >
              ▶ Ver demonstração do Gov.br
            </Link>
            <Link to="/como-funciona" className="botao botao-secundario botao-grande">
              Como funciona
            </Link>
          </div>
          <ul className="selos" aria-label="Benefícios">
            <li><CheckIcon /> Sem instalar nada agora: roda no navegador</li>
            <li><LockIcon /> Senhas nunca saem do aparelho</li>
            <li><PessoasIcon /> Tutoria reversa: jovens ensinam, todos aprendem</li>
          </ul>
        </div>

        <div className="destaque-mock" aria-label="Exemplo da interface assistiva">
          <MockupFalante />
        </div>
      </section>

      <section className="secao" aria-labelledby="tit-servicos">
        <h2 id="tit-servicos">O que o assistente ajuda a fazer</h2>
        <p className="secao-sub">Exemplos de serviços guiados passo a passo (dados fictícios).</p>
        <div className="grade">
          {SERVICOS.map((s) => (
            <article key={s.id} className="cartao">
              <p className="cartao-cat">{s.categoria}</p>
              <h3>{s.nome}</h3>
              <p>
                {s.passos} passos • <strong>{s.dificuldade}</strong>
              </p>
              <Link to="/demonstracao" className="cartao-link">
                Guiar agora <SetaDirIcon />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="secao faixa" aria-labelledby="tit-tutoria">
        <div>
          <h2 id="tit-tutoria">Tutoria reversa: quem ensina também aprende</h2>
          <p>
            Jovens voluntários (como os alunos do IFPA) acompanham os primeiros usos, à distância e sem
            ver suas senhas. Depois de 3 tarefas concluídas sozinho, você ganha o selo{' '}
            <strong>"Independente Digital"</strong>.
          </p>
          <Link to="/tutoria" className="botao botao-primario">
            Conhecer tutores
          </Link>
        </div>
      </section>
    </div>
  );
}