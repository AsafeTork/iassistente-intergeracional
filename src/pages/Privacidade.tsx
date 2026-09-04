import { Link } from 'react-router-dom';

export function Privacidade() {
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

      <div className="grade">
        <article className="cartao">
          <h3>🔒 O que NUNCA sai do aparelho</h3>
          <ul>
            <li>Senhas e códigos SMS</li>
            <li>CPF completo e documentos</li>
            <li>Dados de saúde</li>
          </ul>
        </article>
<article className="cartao">
          <h3>🔓 Pode sair higienizado</h3>
          <ul>
            <li>Estrutura da tela (botões, textos públicos)</li>
            <li>Qual passo você está ("tela 2 de 5")</li>
            <li>Erros genéricos para traduzir</li>
          </ul>
        </article>
        <article className="cartao">
          <h3>👁️ Explicabilidade (RNF02)</h3>
          <p>
            Cada sugestão da IA vem com o motivo em linguagem simples: “destaquei este botão porque é o
            único com o texto Entrar”.
          </p>
        </article>
      </div>

      <section className="secao" aria-label="Demonstração do filtro">
        <h2>Veja o filtro trabalhando (simulação)</h2>
        <div className="filtro-demo">
          <div>
            <h3>Antes (higienizado)</h3>
            <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="var(--verde)" style={{marginRight: 4, verticalAlign: 'middle'}}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style={{color: 'var(--verde)', fontSize: '0.8rem', verticalAlign: 'middle'}}>[REMOVIDO]</span>
            <span style={{color: 'var(--verde)', fontSize: '0.7rem', verticalAlign: 'middle' }}>seguro</span>
            <pre>{`<input name="cpf" value="[REMOVIDO]" />\n<input type="password" value="[REMOVIDO]" />\n<button>Entrar com Gov.br</button>`}</pre>
          </div>
          <div>
            <h3>Depois (higienizado → nuvem)</h3>
            <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="var(--verde)" style={{marginRight: 4, verticalAlign: 'middle'}}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span style={{color: 'var(--verde)', fontSize: '0.8rem', verticalAlign: 'middle'}}>[REMOVIDO]</span>
            <span style={{color: 'var(--verde)', fontSize: '0.7rem', verticalAlign: 'middle' }}>seguro</span>
            <pre>{`<input name="cpf" value="[REMOVIDO]" />\n<input type="password" value="[REMOVIDO]" />\n<button>Entrar com Gov.br</button>`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
