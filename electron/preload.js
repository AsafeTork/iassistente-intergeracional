// Stub do preload do Electron (fase futura). Mantido mínimo e seguro.
window.addEventListener('DOMContentLoaded', () => {
  // Expõe apenas a versão do protótipo, sem Node exposto ao renderer.
  window.__IASSISTENTE__ = { versao: '0.1.0-prototipo' };
});
