// Stub do processo principal do Electron (fase desktop futura).
// Não é empacotado agora. Roteiro completo em docs/ROADMAP-MOBILE-DESKTOP.md
// Futuro: npm i -D electron electron-builder && apontar "main" para este arquivo.
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js') },
  });
  // O build estático do Vite cai em ../dist/index.html
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
