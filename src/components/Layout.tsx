import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAcessibilidade } from '../hooks/useAcessibilidade';

const ROTAS = [
  { para: '/', rotulo: 'Início' },
  { para: '/demonstracao', rotulo: 'Demonstração' },
  { para: '/como-funciona', rotulo: 'Como funciona' },
  { para: '/tutoria', rotulo: 'Tutoria jovem' },
  { para: '/privacidade', rotulo: 'Privacidade' },
  { para: '/acessibilidade', rotulo: 'Acessibilidade' },
  { para: '/sobre', rotulo: 'Sobre' },
];

export function Layout() {
  const { config, alternar } = useAcessibilidade();

  return (
    <div className="app">
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="topo" role="banner">
        <div className="topo-interno">
          <Link to="/" className="marca" aria-label="IAssistente Intergeracional — início">
            <span className="marca-icone" aria-hidden="true">
              IA
            </span>
            <span className="marca-texto">
              <strong>IAssistente</strong>
              <small>Intergeracional</small>
            </span>
          </Link>

          <div className="topo-acoes">
            <button
              type="button"
              className="botao-voz"
              aria-pressed={config.leituraEmVoz}
              onClick={() => alternar('leituraEmVoz')}
              title="Ativar ou desativar leitura em voz alta"
            >
              <span role="status">
                {config.leituraEmVoz ? '🔊 Voz ligada' : '🔇 Voz desligada'}
              </span>
            </button>
            <Link to="/demonstracao" className="botao botao-primario">
              Começar agora
            </Link>
          </div>
        </div>

        <nav className="menu" aria-label="Navegação principal">
          {ROTAS.map((r) => (
            <NavLink
              key={r.para}
              to={r.para}
              end={r.para === '/'}
              className={({ isActive }) => (isActive ? 'menu-link ativo' : 'menu-link')}
            >
              {r.rotulo}
            </NavLink>
          ))}
        </nav>
      </header>

      <main id="conteudo" className="conteudo" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="rodape">
        <p>
          <strong>IAssistente Intergeracional</strong> — protótipo estático para exemplificação (IFPA Bragança).
          Código aberto (MIT).
        </p>
        <p className="rodape-pequeno">
          Demonstração com dados fictícios. Nenhum dado real sai do seu aparelho neste protótipo.
        </p>
      </footer>
    </div>
  );
}
