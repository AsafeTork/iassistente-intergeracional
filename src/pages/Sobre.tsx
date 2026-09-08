import { Link } from 'react-router-dom';
import { REQUISITOS } from '../data/mock';

export function Sobre() {
  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Sobre o projeto
      </p>
      <h1>IAssistente Intergeracional (Tutoria Reversa)</h1>
      <p className="subtitulo">
        Trabalho de Asafe Almeida Tork, Marcos Vinicios e Jefenson Dultra — IFPA Bragança. Proposta de
        plataforma aberta que usa linguagem simples e IA como camada mediadora sobre portais complexos
        como o Gov.br.
      </p>

      <section className="secao" aria-labelledby="tit-problema">
        <h2 id="tit-problema">O problema</h2>
        <p>
          Idosos e pessoas neurodivergentes enfrentam carga cognitiva alta em fluxos densos (login,
          2 fatores, formulários). A conformidade WCAG 2.1 na web brasileira ainda foca em leitores de
          tela, falhando na <strong>compreensibilidade</strong> — e a dependência de terceiros presenciais
          compromete privacidade e dignidade.
        </p>
      </section>

      <section className="secao" aria-labelledby="tit-req">
        <h2 id="tit-req">Requisitos do artigo (cobertos no protótipo)</h2>
        <div className="grade">
          <article className="cartao">
            <h3>Funcionais</h3>
            <ul>
              {REQUISITOS.funcionais.map((r) => (
                <li key={r.codigo}>
                  <strong>{r.codigo}:</strong> {r.texto}
                </li>
              ))}
            </ul>
          </article>
          <article className="cartao">
            <h3>Não funcionais</h3>
            <ul>
              {REQUISITOS.naoFuncionais.map((r) => (
                <li key={r.codigo}>
                  <strong>{r.codigo}:</strong> {r.texto}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <p className="detalhe">
          Neste protótipo estático, RF01 (DOM real) e a IA em nuvem são <em>simulados</em> com roteiro
          fixo e dados fictícios — o suficiente para exemplificar, avaliar com usuários e evoluir para o
          app real sem reescrever a base.
        </p>
      </section>

      <section className="secao" aria-labelledby="tit-emag">
        <h2 id="tit-emag">Conformidade declarada — eMAG 3.1 (Portaria nº 3/2007)</h2>
        <p>
          Este protótipo segue o Modelo de Acessibilidade em Governo Eletrônico (eMAG 3.1):
          marcação semântica, navegação por teclado com link “pular para o conteúdo”,
          contraste mínimo, foco sempre visível e formulários com rótulos e instruções claras.
          Conformidade declarada ao art. 63 do LBI (Lei Brasileira de Inclusão). Divergências conhecidas desta versão de demonstração estão listadas na página{' '}
          <Link to="/acessibilidade">Acessibilidade</Link>.
        </p>
      </section>

      <section className="secao" aria-labelledby="tit-ref">
        <h2 id="tit-ref">Referências do artigo</h2>
        <ul className="lista">
          <li>W3C (2018) — WCAG 2.1</li>
          <li>Barros et al. (2024) — Acessibilidade do Gov.br por ferramentas automatizadas</li>
          <li>Silva et al. (2025) — LLMs para simplificação adaptativa (TEA)</li>
          <li>Souza & Lima (2022) — Inclusão digital de idosos (ProEIDI)</li>
          <li>Aljedaani & Mollik (2026) — LLMs para acessibilidade web (revisão sistemática)</li>
        </ul>
      </section>
    </div>
  );
}
