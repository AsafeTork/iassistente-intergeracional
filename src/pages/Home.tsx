import { Link } from 'react-router-dom';
import { BarraAcessibilidade } from '../components/BarraAcessibilidade';
import { SERVICOS } from '../data/mock';
import { falar, useAcessibilidade } from '../hooks/useAcessibilidade';

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
            <li>✅ Sem instalar nada agora: roda no navegador</li>
            <li>🔒 Senhas nunca saem do aparelho</li>
            <li>👵👧 Tutoria reversa: jovens ensinam, todos aprendem</li>
          </ul>
        </div>

        <div className="destaque-mock" aria-label="Exemplo da interface assistiva">
          <div className="celular">
            <p className="celular-topo">ENTRAR COM GOV.BR</p>
            <div className="celular-campo-destaque">
              <label htmlFor="demo-cpf">Digite seu CPF aqui</label>
              <input id="demo-cpf" placeholder="123.456.789-00" inputMode="numeric" readOnly value="" />
            </div>
            <p className="celular-fala">“Insira o número do seu CPF no espaço com a borda amarela.”</p>
            <span className="celular-botao">Enviar</span>
          </div>
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
                Guiar agora →
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
            <strong>“Independente Digital”</strong>.
          </p>
          <Link to="/tutoria" className="botao botao-primario">
            Conhecer tutores
          </Link>
        </div>
      </section>
    </div>
  );
}
