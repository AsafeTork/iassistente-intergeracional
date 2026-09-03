import type { CapacitorConfig } from '@capacitor/cli';

// Configuração PRONTA para a fase mobile (APK).
// Hoje o `npm run build` gera `dist/` estático; quando for criar o APK:
//   npm run build
//   npx cap add android   (precisa do Android Studio)
//   npx cap sync
//   npx cap open android  → Build > Build APK(s)
// Detalhes em docs/ROADMAP-MOBILE-DESKTOP.md
const config: CapacitorConfig = {
  appId: 'br.edu.ifpa.iassistente',
  appName: 'IAssistente Intergeracional',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
