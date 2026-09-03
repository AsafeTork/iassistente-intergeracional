# IAssistente Intergeracional — Protótipo

Protótipo **estático, funcional e instalável (PWA)** do app descrito no artigo
“IAssistente Intergeracional (Tutoria Reversa)” — Asafe Almeida Tork, Marcos Vinicios e
Jefenson Dultra (IFPA Bragança). Feito para **exemplificar** a proposta: ajudar **idosos e
pessoas com dificuldade visual/cognitiva** a usar portais como o **Gov.br** com autonomia.

> Demonstração com dados 100% fictícios e locais (`localStorage`). Nada é enviado para servidores.

## O que o protótipo mostra

- **Demonstração guiada do login Gov.br** (`/demonstracao`): campo com borda amarela, instrução
  em voz alta (Web Speech API, pt-BR), barra de progresso, simulação de erro técnico → tradução
  acolhedora, selo “Primeiro acesso sozinho”.
- **Como funciona**: as 4 camadas do artigo (captura DOM → filtro de privacidade → nuvem → voz+visual).
- **Tutoria reversa**: catálogo de jovens voluntários + pedido de ajuda salvo localmente.
- **Privacidade**: o que nunca sai do aparelho (RNF03) + demo visual do filtro que higieniza o DOM.
- **Acessibilidade real**: letra grande, alto contraste, modo simples, leitura em voz, navegação por
  teclado, metas WCAG 2.1 AA (contraste 4.5:1, alvos ≥ 48px).
- **Sobre**: problema, requisitos RF01–RF03 / RNF01–RNF03 e referências do artigo.

## Stack e porquê

| Escolha | Motivo |
|---|---|
| **Vite 6 + React 18 + TypeScript** | Build rapidíssimo, padrão 2026 para SPAs; gera `dist/` estático puro |
| **React Router (HashRouter)** | Funciona sem servidor: `file://`, GitHub Pages, WebView Capacitor, Tauri/Electron |
| **CSS próprio mobile-first** | Zero dependência pesada; foco em contraste, fonte grande e safe-areas |
| **vite-plugin-pwa (Workbox)** | Manifest + service worker offline-first; base do futuro “instalar sem loja” |
| **Capacitor-ready** (`capacitor.config.ts`, `webDir: dist`) | O mesmo `dist/` vira **APK/AAB** sem reescrever nada |
| **Tauri/Electron-ready** (`src-tauri-stub/`, `electron/`) | O mesmo `dist/` vira **.exe/.deb** (Tauri leve 3–10 MB; Electron 80–150 MB) |

Alternativas descartadas: Next.js (SSR desnecessário p/ protótipo estático), Astro (ótimo p/ conteúdo, menos p/ app interativo), Flutter (exigiria reescrever tudo em Dart), Ionic (peso extra agora).

**Regra de decisão 2026** ([ourcodeworld.com](https://ourcodeworld.com/articles/read/3646/pwa-vs-capacitor-vs-native-2026)): 1) default a **PWA** (já instalável sem loja); 2) vá a **Capacitor** para App Store/Play Store mantendo 1 codebase web; 3) vá a **nativo** só quando performance for o produto. O mesmo `dist/` do Vite reutiliza em Capacitor (mobile), Tauri 2.x (desktop **+ mobile**, binário 20–50× menor e ~5× menos RAM que Electron ([rustify.rs](https://rustify.rs/articles/rust-tauri-vs-electron-2026))) e qualquer hospedagem estática.

Fontes: tutorial Capacitor+React 2026 ([noqta.tn](https://noqta.tn/en/tutorials/capacitor-react-mobile-app-ios-android-2026)), guia Vite PWA/Workbox ([vite-pwa-org.netlify.app](https://vite-pwa-org.netlify.app/)), decisões PWA/Capacitor/Nativo 2026 ([ourcodeworld.com](https://ourcodeworld.com/articles/read/3646/pwa-vs-capacitor-vs-native-2026)), Tauri vs Electron 2026 ([tech-insider.org](https://tech-insider.org/tauri-vs-electron-2026/), [rustify.rs](https://rustify.rs/articles/rust-tauri-vs-electron-2026)), comparativos 2026 ([oflight.co.jp](https://www.oflight.co.jp/en/columns/flutter-rn-capacitor-tauri-overview-2026), [youngju.dev](https://www.youngju.dev/blog/culture/2026-05-14-desktop-app-frameworks-2026-tauri-electron-wails-compose-multiplatform-maui-flutter-comparison-deep-dive-2026.en)), capawesome.io, WCAG 2.1 AA e guias de design para idosos.

## Como rodar localmente

Pré-requisitos: Node 20+ e npm.

```bash
cd iassistente-intergeracional
npm install
npm run dev      # abre em http://localhost:5173
```

Build estático + prévia:

```bash
npm run build
npm run preview  # serve o dist/ para validar
```

Scripts futuros (só documentam o próximo passo): `npm run build:mobile`, `npm run build:desktop`.

## Estrutura

```
iassistente-intergeracional/
├── src/
│   ├── pages/        # Home, Demonstracao, ComoFunciona, Tutoria, Privacidade, Acessibilidade, Sobre
│   ├── components/   # Layout (topo/menu/rodapé), BarraAcessibilidade
│   ├── hooks/        # useAcessibilidade (persistência + voz pt-BR)
│   ├── data/mock.ts  # passos do Gov.br, serviços, tutores, requisitos
│   ├── App.tsx       # rotas (HashRouter) — pronto p/ file:// e WebView
│   └── index.css     # design system acessível mobile-first
├── public/icons/     # favicon + ícones SVG (trocar por PNG 192/512 ao publicar)
├── capacitor.config.ts   # pronto p/ `npx cap add android`
├── electron/             # stub do processo principal (fase desktop)
├── src-tauri-stub/       # stub tauri.conf.json (fase desktop leve)
└── docs/ROADMAP-MOBILE-DESKTOP.md  # passo a passo APK, EXE, .deb + PWA
```

## Roadmap APK / EXE / .deb

Roteiro completo em [`docs/ROADMAP-MOBILE-DESKTOP.md`](docs/ROADMAP-MOBILE-DESKTOP.md). Resumo:

1. **PWA**: publique `dist/` → “Instalar app” no Chrome/Edge.
2. **APK**: `npm run build && npx cap add android && npx cap sync && npx cap open android` → Build APK(s).
3. **.exe/.deb**: Tauri 2 (leve, recomendado) ou Electron (ecossistema maior), ambos a partir do mesmo `dist/`.

## Limitações do protótipo

- IA/LLM e captura DOM real são **simulados** com roteiro fixo.
- Ícones são SVG placeholder (gerar PNG 192/512 + maskable antes de publicar).
- Voz usa a síntese do aparelho; sem ela, segue só o texto.
- Sem backend: progresso e pedidos vivem no `localStorage` do navegador.

## Licença

MIT — ver [LICENSE](LICENSE).
