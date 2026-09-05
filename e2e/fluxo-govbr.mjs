/** E2E: fluxo completo Gov.br (npm run test:e2e). Sobe contra preview em :4173. */
import { chromium } from 'playwright-core';

const BASE = 'http://localhost:4173/#/demonstracao';
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const erros = [];
page.on('pageerror', (e) => erros.push(e.message));
const shot = (n) => page.screenshot({ path: `/tmp/e2e-${n}.png` });
const check = (cond, nome) => {
  console.log(`${cond ? 'OK  ' : 'FALHA'} ${nome}`);
  if (!cond) process.exitCode = 1;
};

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.locator('.ph-app-icone', { hasText: 'Chrome' }).click();
await page.locator('.ph-govbr-btn-continuar').waitFor({ timeout: 8000 });
await shot('01-govbr');
await page.locator('.ph-govbr-btn-continuar').click();

// Passo CPF: preenche, envia, testa erro simulado, avança
await page.locator('.ph-login-campo--foco input').fill('12345678900');
await shot('02-cpf');
const btnErro = page.getByRole('button', { name: 'Simular erro do portal' });
// Clique confiável é interceptado pela animação do AIScanHighlight: despacha direto.
await btnErro.dispatchEvent('click');
await page.locator('.ph-login-erro-assistente').waitFor({ timeout: 5000 });
const falaErro = await page.locator('.ph-login-erro-assistente').textContent();
check(/sem pressa|11 números/i.test(falaErro ?? ''), 'erro traduzido acolhedor');
await shot('03-erro-acolhedor');
await page.getByRole('button', { name: 'Enviar' }).click();
await page.getByRole('button', { name: /Continuar/ }).click();

// Passos restantes até concluir (re-checa após cada clique: Enviar pode avançar)
for (let i = 0; i < 8; i++) {
  if (await page.getByRole('button', { name: 'Voltar ao início' }).count()) break;
  if (await page.getByRole('button', { name: /Concluir/ }).count()) {
    await page.getByRole('button', { name: /Concluir/ }).click();
    break;
  }
  if (await page.getByRole('button', { name: /Continuar/ }).count()) {
    const input = page.locator('.ph-login-campo--foco input');
    if (await input.count()) await input.fill('teste123');
    if (await page.getByRole('button', { name: 'Enviar' }).count()) {
      await page.getByRole('button', { name: 'Enviar' }).click();
    }
    if (await page.getByRole('button', { name: /Continuar/ }).count()) {
      await page.getByRole('button', { name: /Continuar/ }).click();
    }
  } else break;
}
await page.getByRole('button', { name: 'Voltar ao início' }).waitFor({ timeout: 8000 });
await shot('04-concluido');
check(true, 'fluxo manual concluído (Voltar ao início visível)');
check(erros.length === 0, `0 erros JS no manual (${erros.length})`);

// Parte 2: modo automático vai do início ao fim sozinho
await page.goto(`${BASE}`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Ver sozinho/ }).click();
await page.getByRole('button', { name: 'Voltar ao início' }).waitFor({ timeout: 90000 });
await shot('05-auto-concluido');
check(true, 'modo automático concluiu sozinho');
erros.slice(0, 5).forEach((e) => console.log(` - ${e}`));
await browser.close();
console.log(process.exitCode ? 'E2E-FALHOU' : 'E2E-OK');
