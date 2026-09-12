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
    <div className="d-flex flex-column min-vh-100">
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="navbar navbar-expand-lg navbar-dark sticky-top" role="banner" style={{ background: 'var(--mar)' }}>
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2" aria-label="IAssistente Intergeracional — início">
            <span className="marca-icone" aria-hidden="true" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--cupuacu)' }}>
              IA
            </span>
            <span className="marca-texto">
              <strong>IAssistente</strong>
              <small className="d-block" style={{ fontSize: '0.7rem', opacity: 0.8 }}>Intergeracional</small>
            </span>
          </Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Menu de navegação">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <nav className="navbar-nav ms-auto" aria-label="Navegação principal">
              {ROTAS.map((r) => (
                <NavLink
                  key={r.para}
                  to={r.para}
                  end={r.para === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={{ color: 'var(--paper)', fontWeight: 600 }}
                >
                  {({ isActive }) => (
                    <span aria-current={isActive ? 'page' : undefined}>{r.rotulo}</span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                aria-pressed={config.leituraEmVoz}
                onClick={() => alternar('leituraEmVoz')}
                title="Ativar ou desativar leitura em voz alta"
              >
                <span role="status">
                  {config.leituraEmVoz ? '🔊 Voz ligada' : '🔇 Voz desligada'}
                </span>
              </button>
              <Link to="/demonstracao" className="btn btn-primary">
                Começar agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="conteudo" className="flex-grow-1" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="bg-dark text-light py-4 mt-auto" role="contentinfo">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="fw-bold mb-1">Projeto IFPA Bragança</p>
              <p className="mb-0">
                <strong>IAssistente Intergeracional</strong> — protótipo estático para exemplificação (IFPA Bragança).
                Código aberto (MIT).
              </p>
            </div>
            <div className="col-md-6">
              <p className="fw-bold mb-1">Dados fictícios</p>
              <p className="small mb-0" style={{ opacity: 0.8 }}>
                Demonstração com dados fictícios. Nenhum dado real sai do seu aparelho neste protótipo.
              </p>
            </div>
          </div>
          <nav aria-label="Voltar ao topo" className="mt-3">
            <a href="#conteudo" className="text-light" style={{ textDecoration: 'underline' }}>
              ↑ Voltar ao início
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}