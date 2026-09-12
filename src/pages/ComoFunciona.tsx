import { Link } from 'react-router-dom';

const CAMADAS = [
  {
    titulo: '1. Captura local (no seu celular)',
    texto: 'O app lê a estrutura da página (árvore DOM) e tira uma "foto" do que aparece na tela.',
    icone: '📱',
  },
  {
    titulo: '2. Filtro de privacidade (no seu celular)',
    texto: 'Antes de qualquer envio, senhas e dados pessoais são removidos aqui mesmo no aparelho.',
    icone: '🔒',
  },
  {
    titulo: '3. Cérebro na nuvem (leve para o celular)',
    texto: 'A parte pesada (modelos de linguagem) roda em servidor e devolve instruções simples.',
    icone: '☁️',
  },
  {
    titulo: '4. Ajuda falada + destaque visual',
    texto: 'O app mostra setas, bordas amarelas e dita cada ação. Erros técnicos viram mensagens amigáveis.',
    icone: '🗣️',
  },
];

export function ComoFunciona() {
  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Como funciona
      </p>
      <h1>Uma "película inteligente" sobre o navegador</h1>
      <p className="subtitulo">
        O app não muda os sites do governo: ele <strong>acompanha a tela</strong>, esconde a poluição
        visual e reapresenta cada tarefa em blocos pequenos e fáceis de digerir (desconstrução cognitiva).
      </p>

      <div className="row g-3">
        {CAMADAS.map((c) => (
          <article key={c.titulo} className="col-md-6 card">
            <p className="fs-3 mb-2" aria-hidden="true">{c.icone}</p>
            <h3 className="h5">{c.titulo}</h3>
            <p>{c.texto}</p>
          </article>
        ))}
      </div>

      <section className="secao" aria-labelledby="tit-fluxo">
        <h2 id="tit-fluxo" className="h3">Fluxo de uma ajuda (igual ao diagrama do projeto)</h2>
        <ol className="list-group list-group-numbered mb-3">
          <li className="list-group-item">Você abre o Gov.br</li>
          <li className="list-group-item">O app captura a tela (DOM)</li>
          <li className="list-group-item">Tem dado sensível? <strong>Sim → limpa tudo</strong> / Não → segue</li>
          <li className="list-group-item">A nuvem entende e manda o passo simplificado</li>
          <li className="list-group-item">Você ouve e vê o destaque na tela — e conclui a tarefa</li>
        </ol>
        <p className="text-muted">
          Um cache local guarda telas comuns (como o login) para funcionar mesmo com internet fraca —
          importante para redes móveis instáveis.
        </p>
      </section>

      <section className="secao alert alert-primary" aria-labelledby="tit-cache">
        <h2 id="tit-cache" className="h3">Por que este protótipo é "offline-first"?</h2>
        <p className="mb-3">
          Todas as telas de exemplo funcionam sem internet depois do primeiro acesso (PWA + cache). No
          futuro app real, o mapa das telas mais usadas também ficará salvo para respostas instantâneas.
        </p>
        <Link to="/privacidade" className="btn btn-secondary">
          Ver como a privacidade é garantida
        </Link>
      </section>
    </div>
  );
}