import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { NUNCA_SAI, PODE_SAIR, higienizarDOM } from '../lib/filtroPrivacidade';

const EXEMPLO_BRUTO = `<input name="cpf" value="123.456.789-00" />\n<input type="password" value="minha-senha" />\n<button>Entrar com Gov.br</button>`;

export function Privacidade() {
  const demo = useMemo(() => higienizarDOM(EXEMPLO_BRUTO), []);
  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Privacidade
      </p>
      <h1>Sua senha nunca sai do seu aparelho</h1>
      <p className="subtitulo">
        Requisito do projeto (RNF03): o <strong>filtro de privacidade local</strong> remove senhas, CPF e
        dados de saúde <em>antes</em> de qualquer envio à nuvem. O tutor humano também não tem acesso.
      </p>

      <div className="row g-3">
        <article className="col-md-4 card">
          <div className="card-body">
            <h2 className="h5">🔒 O que NUNCA sai do aparelho</h2>
            <ul className="list-unstyled">
              <li>Senhas e códigos SMS</li>
              <li>CPF completo e documentos</li>
              <li>Dados de saúde</li>
            </ul>
          </div>
        </article>
        <article className="col-md-4 card">
          <div className="card-body">
            <h2 className="h5">🔓 Pode sair higienizado</h2>
            <ul className="list-unstyled">
              <li>Estrutura da tela (botões, textos públicos)</li>
              <li>Qual passo você está ("tela 2 de 5")</li>
              <li>Erros genéricos para traduzir</li>
            </ul>
          </div>
        </article>
        <article className="col-md-4 card">
          <div className="card-body">
            <h2 className="h5">👁️ Explicabilidade (RNF02)</h2>
            <p>
              Cada sugestão da IA vem com o motivo em linguagem simples: "destaquei este botão porque é o
              único com o texto Entrar".
            </p>
          </div>
        </article>
      </div>

      <section className="secao" aria-label="Demonstração do filtro">
        <h2 className="h3">Veja o filtro trabalhando (de verdade, neste aparelho)</h2>
        <p className="text-muted">
          O exemplo abaixo passa pelo <strong>mesmo código</strong> que protege o app
          ({demo.removidos} campos removidos: {demo.categorias.join(', ')}).
        </p>
        <div className="row g-3">
          <div className="col-md-6">
            <h4>Antes (tela bruta — nunca sai)</h4>
            <pre className="bg-light p-3 rounded border">{EXEMPLO_BRUTO}</pre>
          </div>
          <div className="col-md-6">
            <h4>Depois (higienizado → nuvem)</h4>
            <pre className="bg-light p-3 rounded border">{demo.higienizado}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}