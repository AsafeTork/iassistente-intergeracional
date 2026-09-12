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

      <section className="secao mb-4" aria-labelledby="tit-problema">
        <h2 id="tit-problema" className="h3">O problema</h2>
        <p>
          Idosos e pessoas neurodivergentes enfrentam carga cognitiva alta em fluxos densos (login,
          2 fatores, formulários). A conformidade WCAG 2.1 na web brasileira ainda foca em leitores de
          tela, falhando na <strong>compreensibilidade</strong> — e a dependência de terceiros presenciais
          compromete privacidade e dignidade.
        </p>
      </section>

      <section className="secao mb-4" aria-labelledby="tit-req">
        <h2 id="tit-req" className="h3">Requisitos do artigo (cobertos no protótipo)</h2>
        <div className="row g-3">
          <article className="col-md-6 card">
            <div className="card-body">
              <h3 className="h5">Funcionais</h3>
              <ul className="list-group list-group-flush">
                {REQUISITOS.funcionais.map((r) => (
                  <li key={r.codigo} className="list-group-item">
                    <strong>{r.codigo}:</strong> {r.texto}
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <article className="col-md-6 card">
            <div className="card-body">
              <h3 className="h5">Não funcionais</h3>
              <ul className="list-group list-group-flush">
                {REQUISITOS.naoFuncionais.map((r) => (
                  <li key={r.codigo} className="list-group-item">
                    <strong>{r.codigo}:</strong> {r.texto}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
        <p className="text-muted mt-3">
          Neste protótipo estático, RF01 (DOM real) e a IA em nuvem são <em>simulados</em> com roteiro
          fixo e dados fictícios — o suficiente para exemplificar, avaliar com usuários e evoluir para o
          app real sem reescrever a base.
        </p>
      </section>

      <section className="secao mb-4" aria-labelledby="tit-emag">
        <h2 id="tit-emag" className="h3">Conformidade declarada — eMAG 3.1 (Portaria nº 3/2007)</h2>
        <p>
          Este protótipo segue o Modelo de Acessibilidade em Governo Eletrônico (eMAG 3.1):
          marcação semântica, navegação por teclado com link "pular para o conteúdo",
          contraste mínimo, foco sempre visível e formulários com rótulos e instruções claras.
          Conformidade declarada ao art. 63 do LBI (Lei Brasileira de Inclusão). Divergências conhecidas desta versão de demonstração estão listadas na página{' '}
          <Link to="/acessibilidade">Acessibilidade</Link>.
        </p>
      </section>

      <section className="secao mb-4" aria-labelledby="tit-ref">
        <h2 id="tit-ref" className="h3">Referências do artigo</h2>
        <ul className="list-group">
          <li className="list-group-item">W3C (2018) — WCAG 2.1</li>
          <li className="list-group-item">Barros et al. (2024) — Acessibilidade do Gov.br por ferramentas automatizadas</li>
          <li className="list-group-item">Silva et al. (2025) — LLMs para simplificação adaptativa (TEA)</li>
          <li className="list-group-item">Souza & Lima (2022) — Inclusão digital de idosos (ProEIDI)</li>
          <li className="list-group-item">Aljedaani & Mollik (2026) — LLMs para acessibilidade web (revisão sistemática)</li>
        </ul>
      </section>
    </div>
  );
}