import { Link } from 'react-router-dom';
import { useAcessibilidade } from '../hooks/useAcessibilidade';

export function Acessibilidade() {
  const { config, alternar } = useAcessibilidade();

  const opcoes: { chave: keyof typeof config; titulo: string; texto: string }[] = [
    {
      chave: 'fonteGrande',
      titulo: 'Letra grande (WCAG 1.4.4)',
      texto: 'Aumenta todo o texto para leitura confortável. Meta: suportar 200% sem quebrar.',
    },
    {
      chave: 'altoContraste',
      titulo: 'Alto contraste (WCAG 1.4.3 / 1.4.11)',
      texto: 'Texto 4.5:1, botões 3:1. Essencial sob sol forte e para baixa visão.',
    },
    {
      chave: 'modoSimples',
      titulo: 'Layout simplificado',
      texto: 'Esconde cartões extras e foca em uma tarefa por vez (desconstrução cognitiva).',
    },
    {
      chave: 'leituraEmVoz',
      titulo: 'Leitura em voz alta',
      texto: 'Usa a voz do próprio aparelho (pt-BR), sem enviar áudio para servidores neste protótipo.',
    },
  ];

  return (
    <div>
      <p className="migalha">
        <Link to="/">Início</Link> › Acessibilidade
      </p>
      <h1>Ajustes que respeitam seu ritmo</h1>
      <p className="subtitulo">
        Tudo muda na hora e fica salvo neste navegador. Teste agora — esta página é a prova viva do
        pilar “compreensibilidade” da WCAG 2.1.
      </p>

      <div className="grade">
        {opcoes.map((o) => (
          <article key={o.chave} className="cartao">
            <h3>{o.titulo}</h3>
            <p>{o.texto}</p>
            <button
              type="button"
              className={config[o.chave] ? 'botao botao-secundario' : 'botao botao-primario'}
              aria-pressed={config[o.chave]}
              onClick={() => alternar(o.chave)}
            >
              {config[o.chave] ? 'Desativar' : 'Ativar'}
            </button>
          </article>
        ))}
      </div>

      <section className="secao" aria-label="Compromissos">
        <h2>Compromissos deste protótipo</h2>
        <ul className="lista">
          <li>🎯 Botões com no mínimo 48px de altura (toque fácil)</li>
          <li>⌨️ Navegável por teclado + link “pular para o conteúdo”</li>
          <li>📐 Funciona em retrato e paisagem, do celular ao desktop</li>
          <li>🗣️ Textos sem jargão: “token expirado” vira “o código venceu, peça outro”</li>
        </ul>
      </section>
    </div>
  );
}
