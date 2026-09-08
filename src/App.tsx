import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProvedorAcessibilidade } from './hooks/useAcessibilidade';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Demonstracao = lazy(() => import('./pages/Demonstracao').then(m => ({ default: m.Demonstracao })));
const ComoFunciona = lazy(() => import('./pages/ComoFunciona').then(m => ({ default: m.ComoFunciona })));
const Tutoria = lazy(() => import('./pages/Tutoria').then(m => ({ default: m.Tutoria })));
const Privacidade = lazy(() => import('./pages/Privacidade').then(m => ({ default: m.Privacidade })));
const Acessibilidade = lazy(() => import('./pages/Acessibilidade').then(m => ({ default: m.Acessibilidade })));
const Sobre = lazy(() => import('./pages/Sobre').then(m => ({ default: m.Sobre })));

function Carregando() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--cor-texto)' }}>
      Carregando...
    </div>
  );
}

export function App() {
  return (
    <ProvedorAcessibilidade>
      <HashRouter>
        <Suspense fallback={<Carregando />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="demonstracao" element={<Demonstracao />} />
              <Route path="como-funciona" element={<ComoFunciona />} />
              <Route path="tutoria" element={<Tutoria />} />
              <Route path="privacidade" element={<Privacidade />} />
              <Route path="acessibilidade" element={<Acessibilidade />} />
              <Route path="sobre" element={<Sobre />} />
              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ProvedorAcessibilidade>
  );
}
