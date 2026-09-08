import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Protótipo estático: gera `dist/` puro (site estático).
// O mesmo `dist/` é reusado como `webDir` do Capacitor (APK) e do Tauri/Electron (.exe/.deb).
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'icons/*.svg', 'icons/*.png', 'screenshots/*.png'],
      manifest: {
        name: 'IAssistente Intergeracional',
        short_name: 'IAssistente',
        description:
          'Tutoria reversa e mediação tecnológica ativa: ajuda passo a passo, com voz e destaque visual, para idosos e PcD usarem portais como o Gov.br.',
        lang: 'pt-BR',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0b3b5b',
        theme_color: '#0b3b5b',
        categories: ['accessibility', 'education', 'utilities'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/maskable-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/screenshot-narrow.png',
            sizes: '540x960',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Demonstração do IAssistente — visão estreita (mobile)',
          },
          {
            src: 'screenshots/screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Demonstração do IAssistente — visão ampla (desktop)',
          },
        ],
        shortcuts: [
          {
            name: 'Demonstração',
            short_name: 'Demo',
            description: 'Ver demonstração interativa do IAssistente',
            url: '/#/demonstracao',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Tutoria',
            short_name: 'Tutoria',
            description: 'Iniciar tutoria passo a passo',
            url: '/#/tutoria',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          pwa: ['workbox-window'],
        },
      },
    },
  },
});
