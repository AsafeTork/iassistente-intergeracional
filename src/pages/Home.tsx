import { Link } from 'react-router-dom';
import { useEffect } from 'react';
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

function SetaCtaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

export function Home() {
  const { config } = useAcessibilidade();

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach((el) => el.classList.add('visivel'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); }
      }),
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div>
      <BarraAcessibilidade />

      <section className="destaque" aria-labelledby="tit-hero">
        <div className="destaque-texto">
          <p className="etiqueta anim-hero anim-hero-1">Gov.br • Acessível • Gratuito</p>
          <h1 id="tit-hero" className="anim-hero anim-hero-2">
            O celular explica <span className="realce">passo a passo</span>
          </h1>
          <p className="subtitulo anim-hero anim-hero-3">
            Voz calma e letra grande para usar portais como o <strong>Gov.br</strong> sozinho, com segurança e sem medo.
          </p>
          <div className="acoes anim-hero anim-hero-4 d-flex flex-wrap gap-2">
            <Link
              to="/demonstracao"
              className="btn btn-primary btn-lg"
              onClick={() =>
                falar('Vamos começar a demonstração do login com ajuda passo a passo.', config.leituraEmVoz)
              }
            >
              Ver demonstração <span className="seta" aria-hidden="true"><SetaCtaIcon /></span>
            </Link>
          </div>
          <ul className="selos list-unstyled anim-hero anim-hero-5" aria-label="Benefícios">
            <li className="mb-2"><CheckIcon /> Funciona no navegador, sem instalar nada</li>
            <li className="mb-2"><LockIcon /> Suas senhas ficam só no seu aparelho</li>
            <li className="mb-2"><PessoasIcon /> Tutoria reversa: jovens ensinam, todos aprendem</li>
          </ul>
        </div>

        <div className="destaque-mock" role="img" aria-label="Exemplo da interface assistiva">
          <MockupFalante />
        </div>
      </section>

      <section className="secao reveal" aria-labelledby="tit-servicos">
        <h2 id="tit-servicos" className="h3">O que o assistente ajuda a fazer</h2>
        <p className="secao-sub">Exemplos de serviços guiados passo a passo (dados fictícios).</p>
        <div className="grade row g-3">
          {SERVICOS.map((s, i) => (
            <article
              key={s.id}
              className={`col-md-6 ${i === 0 ? 'col-md-7' : 'col-md-5'} ${i === 0 ? 'card border-start border-4 border-primary' : 'card'} animate-entrada`}
              style={{ animationDelay: `${Math.min(i, 7) * 80}ms` }}
            >
              {i === 0 && <span className="badge bg-primary mb-2">Mais pedido</span>}
              <p className="text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', color: 'var(--mar-tinta)', fontWeight: 700 }}>{s.categoria}</p>
              <h3 className="h5">{s.nome}</h3>
              <p className="text-muted">
                {s.passos} passos • <strong>{s.dificuldade}</strong>
              </p>
              <Link to="/demonstracao" className="btn btn-sm btn-primary">
                Guiar agora <SetaDirIcon />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="secao faixa alert alert-primary mb-0" aria-labelledby="tutoria">
        <div>
          <h2 id="tit-tutoria" className="h3">Tutoria reversa</h2>
          <p className="mb-3">
            Jovens voluntários ensinam os primeiros passos, sem ver suas senhas. Depois de 3 tarefas feitas sozinho, você ganha o selo{' '}
            <strong>"Independente Digital"</strong>.
          </p>
          <Link to="/tutoria" className="btn btn-primary btn-lg">
            Conhecer tutores
          </Link>
        </div>
      </section>
    </div>
  );
}