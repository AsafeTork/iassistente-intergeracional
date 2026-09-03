# Roadmap: do site estático ao APK, EXE e .deb

Este protótipo já nasce **pronto para evoluir sem reescrever nada**: o build do Vite gera
`dist/` estático, que é exatamente o que Capacitor (mobile), PWA, Electron e Tauri (desktop) consomem.

## 0. Situação atual (protótipo)

- Site 100% estático: `npm install && npm run dev` (desenvolver), `npm run build` + `npm run preview` (validar).
- Rotas com `HashRouter` — funcionam em `file://`, GitHub Pages, WebView do Capacitor e janela do Tauri/Electron sem servidor.
- PWA já configurado via `vite-plugin-pwa` (manifest + service worker com Workbox, cache offline-first).
- Pastas separadas: `src/pages`, `src/components`, `src/data`, `src/hooks`, `public/`.

## 1. PWA instalável (curto prazo, sem loja)

1. Publique `dist/` em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Nginx).
2. Abra no Chrome/Edge Android → “Instalar app”. No iOS 18+ o Web Push e a instalação já são comportamento base.
3. Valide com Lighthouse (DevTools → Application → Manifest + Service Workers).

## 2. APK Android via Capacitor (recomendado para mobile)

Por que Capacitor e não Flutter/React Native? Porque ele **empacota o mesmo `dist/`** numa WebView
nativa: reaproveitamento ~100%, curva de aprendizado mínima para quem já é web, PWA continua
funcionando em paralelo, plugins TypeScript-first (câmera, push, biometria). Flutter exigiria
reescrever tudo em Dart.

Passos:

```bash
npm run build
npx cap add android      # precisa do Android Studio instalado
npx cap sync             # copia dist/ + plugins para o projeto nativo
npx cap open android     # abre no Android Studio
# No Android Studio: Build > Build Bundle(s)/APK(s) > Build APK(s)
```

- O APK debug fica em `android/app/build/outputs/apk/debug/app-debug.apk`.
- Para Play Store, gere AAB assinado: `./gradlew bundleRelease` + keystore.
- Ícones/splash: `npm i -D @capacitor/assets && npx capacitor-assets generate`.
- O `capacitor.config.ts` já existe na raiz com `appId: br.edu.ifpa.iassistente` e `webDir: dist`.
- A cada mudança web: `npm run build && npx cap sync`.

## 3. Desktop: .exe (Windows) e .deb (Linux)

Duas opções, ambas consumindo o mesmo `dist/`:

### Opção A — Tauri 2 (recomendada: binário 3–10 MB)

- Prós: binário minúsculo, pouco RAM, usa WebView do sistema, segurança endurecida (Rust), gera `.deb`, `.AppImage`, `.exe` (nsis) e `.dmg`.
- Contras: exige toolchain Rust + dependências de sistema.
- Stub inicial em `src-tauri-stub/tauri.conf.json` (copie para `src-tauri/` quando for implementar).
- Passos futuros: `cargo install tauri-cli`, `npx @tauri-apps/cli init`, `npm run build`, `npx tauri build`.

### Opção B — Electron (maior compatibilidade/plugins)

- Prós: só precisa de npm, ecossistema gigante, Live Updates fáceis; stub em `electron/main.js`.
- Contras: binário 80–150 MB (Chromium embutido), mais RAM.
- Passos futuros: `npm i -D electron electron-builder`, configurar `electron-builder.yml` com alvos `nsis` (exe) e `deb`, `npm run build && electron-builder`.

Recomendação: **Tauri para distribuir .deb leve em laboratórios/UBS; Electron se precisar de plugin que só exista no ecossistema Node.**

## 4. Quando ligar o backend real (pós-protótipo)

- RF01 (captura DOM real): virar extensão de navegador ou injeção via WebView do Capacitor.
- Motor LLM na nuvem: endpoint que recebe só o DOM higienizado e devolve passos; manter o filtro de privacidade no cliente (RNF03).
- Cache de telas comuns (ex.: login Gov.br) para redes instáveis — o Workbox já deixa o padrão pronto no frontend.

## 5. Checklist de publicação

- [ ] `npm run build` sem erros
- [ ] Lighthouse PWA ≥ 90
- [ ] Testar com NVDA/TalkBack + teclado
- [ ] Gerar ícones PNG 192/512 + maskable (substituir os SVG placeholder em `public/icons/`)
- [ ] Definir hospedagem do `dist/` e URL pública
- [ ] Assinar APK/AAB (keystore) e instaladores desktop
