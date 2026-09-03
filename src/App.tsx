import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProvedorAcessibilidade } from './hooks/useAcessibilidade';
import { Acessibilidade } from './pages/Acessibilidade';
import { ComoFunciona } from './pages/ComoFunciona';
import { Demonstracao } from './pages/Demonstracao';
import { Home } from './pages/Home';
import { Privacidade } from './pages/Privacidade';
import { Sobre } from './pages/Sobre';
import { Tutoria } from './pages/Tutoria';

// HashRouter: funciona em site 100% estático (file://, GitHub Pages,
// Capacitor WebView e Tauri/Electron com index.html local) sem precisar
// de reescrita de rotas no servidor.
export function App() {
  return (
    <ProvedorAcessibilidade>
      <HashRouter>
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
      </HashRouter>
    </ProvedorAcessibilidade>
  );
}
