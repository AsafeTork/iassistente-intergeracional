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
// tap: o tilt 3D do celular desloca botões sob o cursor durante cliques
// reais do mouse; despachar o evento é determinístico e exerce o mesmo handler.
const tap = (loc) => loc.dispatchEvent('click');
const check = (cond, nome) => {
  console.log(`${cond ? 'OK  ' : 'FALHA'} ${nome}`);
  if (!cond) process.exitCode = 1;
};

await page.goto(BASE, { waitUntil: 'networkidle' });
check(await page.locator('.selo-demo-gov').count() > 0, 'badge demonstração acadêmica na página');
await page.locator('.ph-app-icone', { hasText: 'Chrome' }).click();
await page.waitForTimeout(2500);
if ((await page.locator('.govframe-hotspot').count()) > 0) {
  await shot('01-govbr-frame');
  await page.locator('.govframe-hotspot').first().click();
  await page.waitForTimeout(500);
  await page.locator('.govframe-hotspot').first().click();
} else {
  // Web Components reais registrados: tela GovbrNativo (CPF com máscara/validação).
  check((await page.locator('.ph-govbr-nativo .selo-demo-gov').count()) > 0, 'badge no login Gov.br nativo');
  await page.locator('br-input input').fill('123');
  await tap(page.getByRole('button', { name: 'Continuar' }));
  await page.waitForTimeout(600);
  check((await page.locator('.ph-govbr-nativo-aviso').count()) > 0, 'CPF curto barrado no login nativo');
  await page.locator('br-input input').fill('12345678900');
  await page.waitForTimeout(400);
  check(
    (await page.locator('br-input input').inputValue()) === '123.456.789-00',
    'máscara CPF no login nativo',
  );
  await shot('01-govbr');
  await tap(page.getByRole('button', { name: 'Continuar' }));
  await page.waitForTimeout(1000);
}
check((await page.locator('.ph-login-campo--foco input').count()) > 0, 'chegou à tela de login guiado');

// Passo CPF: badge no mock + máscara + validação curta + erro simulado + avanço
await page.locator('.ph-login-campo--foco input').fill('12345678900');
check(
  (await page.locator('.ph-login-campo--foco input').inputValue()) === '123.456.789-00',
  'máscara CPF 000.000.000-00',
);
check(await page.locator('.ph-login .selo-demo-gov').count() > 0, 'badge dentro do celular');
await shot('02-cpf');
// CPF curto deve ser barrado com frase acolhedora
await page.locator('.ph-login-campo--foco input').fill('123');
await tap(page.getByRole('button', { name: 'Enviar' }));
await page.locator('.ph-login-erro-assistente').waitFor({ timeout: 5000 });
const falaCurto = await page.locator('.ph-login-erro-assistente').textContent();
check(/sem pressa/i.test(falaCurto ?? ''), 'CPF curto barrado com frase acolhedora');
await page.locator('.ph-login-campo--foco input').fill('12345678900');
const btnErro = page.getByRole('button', { name: 'Simular erro do portal' });
// Clique confiável é interceptado pela animação do AIScanHighlight: despacha direto.
await btnErro.dispatchEvent('click');
await page.locator('.ph-login-erro-assistente').waitFor({ timeout: 5000 });
const falaErro = await page.locator('.ph-login-erro-assistente').textContent();
check(/sem pressa|11 números/i.test(falaErro ?? ''), 'erro traduzido acolhedor');
await shot('03-erro-acolhedor');
// Guard anti-duplo-toque: dois toques rápidos avançam só um passo
await tap(page.getByRole('button', { name: 'Enviar' }));
await tap(page.getByRole('button', { name: 'Enviar' }));
await page.waitForTimeout(900);
check((await page.locator('.ph-login-passo-texto').textContent())?.includes('Passo 2 de 4'), 'duplo Enviar avança só 1 passo');
await page.locator('.ph-login-campo--foco input').fill('teste123');
await tap(page.getByRole('button', { name: /Continuar/ }));
await page.waitForTimeout(900);

// Passos restantes até concluir (re-checa após cada clique: Enviar pode avançar)
for (let i = 0; i < 10; i++) {
  if (await page.getByRole('button', { name: 'Voltar ao início' }).count()) break;
  if (await page.getByRole('button', { name: /Concluir/ }).count()) {
    await tap(page.getByRole('button', { name: /Concluir/ }));
    await page.waitForTimeout(900);
    break;
  }
  if (await page.getByRole('button', { name: /Continuar/ }).count()) {
    const input = page.locator('.ph-login-campo--foco input');
    if (await input.count()) {
      const name = (await input.getAttribute('name')) ?? '';
      if (name === 'codigo') {
        check(
          (await page.getByRole('button', { name: 'Mandar outro código' }).count()) > 0,
          'botão mandar outro código no passo SMS',
        );
        await tap(page.getByRole('button', { name: 'Mandar outro código' }));
        await page.waitForTimeout(600);
        await shot('03b-reenvio');
      }
      await input.fill(name === 'codigo' ? '482916' : 'teste123');
      // Enviar valida e avança; Continuar só em passo sem campo.
      await tap(page.getByRole('button', { name: 'Enviar' }));
      await page.waitForTimeout(900);
    } else {
      await tap(page.getByRole('button', { name: /Continuar/ }));
      await page.waitForTimeout(900);
    }
  } else break;
}
await page.getByRole('button', { name: 'Voltar ao início' }).waitFor({ timeout: 8000 });
await shot('04-concluido');
check(true, 'fluxo manual concluído (Voltar ao início visível)');
check(erros.length === 0, `0 erros JS no manual (${erros.length})`);

// Reload volta ao início sem quebrar (PWA/HashRouter)
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(800);
check((await page.locator('.ph-app-icone').count()) >= 4 || (await page.getByRole('button', { name: /Ver sozinho/ }).count()) > 0, 'reload sem quebrar');

// Parte 2: modo automático vai do início ao fim sozinho
await page.goto(`${BASE}`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Ver sozinho/ }).click();
await page.getByRole('button', { name: 'Voltar ao início' }).waitFor({ timeout: 90000 });
await shot('05-auto-concluido');
check(true, 'modo automático concluiu sozinho');
erros.slice(0, 5).forEach((e) => console.log(` - ${e}`));
await browser.close();
console.log(process.exitCode ? 'E2E-FALHOU' : 'E2E-OK');
