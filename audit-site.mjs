import { chromium } from 'playwright';
import fs from 'fs';

const URL = 'https://iassistente-intergeracional.onrender.com/';
const PAGES = [
  { path: '', name: 'home' },
  { path: 'demonstracao', name: 'demo' },
  { path: 'como-funciona', name: 'como' },
  { path: 'tutoria', name: 'tutoria' },
  { path: 'privacidade', name: 'privacidade' },
  { path: 'acessibilidade', name: 'acessibilidade' },
  { path: 'sobre', name: 'sobre' }
];

const VIEWPORTS = [
  { width: 375, height: 667, name: 'mobile' },
  { width: 1280, height: 720, name: 'desktop' }
];

async function audit() {
  const browser = await chromium.launch({ headless: true });
  
  for (const pageInfo of PAGES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: vp.width, height: vp.height });
      
      try {
        await page.goto(URL + pageInfo.path, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1000);
        
        // Screenshot
        const filename = `/tmp/auditoria-${pageInfo.name}-${vp.name}.png`;
        await page.screenshot({ path: filename, fullPage: true });
        console.log(`✓ ${filename}`);
        
        // Quick DOM checks
        const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        const hasFocusStyles = await page.evaluate(() => {
          const sheets = Array.from(document.styleSheets);
          let found = false;
          for (const sheet of sheets) {
            try {
              const rules = Array.from(sheet.cssRules || []);
              for (const rule of rules) {
                if (rule.selectorText?.includes('focus-visible') && rule.style?.outline?.includes('FFCD07')) {
                  found = true; break;
                }
              }
            } catch(e) {}
          }
          return found;
        });
        
        const heroBorder = await page.$eval('.destaque', el => getComputedStyle(el).borderLeftColor).catch(() => 'N/A');
        const cardBorder = await page.$eval('.cartao-destaque, .grade .cartao:first-child', el => getComputedStyle(el).borderLeftColor).catch(() => 'N/A');
        
        console.log(`  body bg: ${bodyBg} | focus: ${hasFocusStyles} | hero border-left: ${heroBorder} | card border-left: ${cardBorder}`);
        
      } catch (e) {
        console.log(`✗ ${pageInfo.name}-${vp.name}: ${e.message}`);
      }
      await page.close();
    }
  }
  
  await browser.close();
  console.log('\nAuditoria completa. Screenshots em /tmp/auditoria-*.png');
}

audit().catch(console.error);