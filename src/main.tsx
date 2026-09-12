import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import 'bootstrap/dist/css/bootstrap.min.css';
import { App } from './App';
import './index.css';

// Bootstrap JS (popper, collapse, modal, etc.)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// PWA: atualiza o app automaticamente quando houver build novo.
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
