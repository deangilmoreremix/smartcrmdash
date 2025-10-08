import { Page } from '@playwright/test';

export async function brandOverlay(page: Page, logoHref?: string) {
  await page.addStyleTag({ content: `
    .__brandRibbon__ {
      position: fixed; top: 14px; right: 14px; z-index: 999998;
      background: rgba(0,0,0,.55); color: #fff; backdrop-filter: blur(6px);
      display: flex; align-items: center; gap: 10px;
      padding: 8px 12px; border-radius: 12px; font: 600 13px/1 Inter, system-ui;
    }
    .__brandRibbon__ img { width: 20px; height: 20px; object-fit: contain; }
  `});
  await page.evaluate((logoHref) => {
    const ex = document.querySelector('.__brandRibbon__'); if (ex) return;
    const ribbon = document.createElement('div');
    ribbon.className = '__brandRibbon__';
    if (logoHref) {
      const img = document.createElement('img'); img.src = logoHref; img.alt = 'SmartCRM';
      ribbon.appendChild(img);
    }
    const span = document.createElement('span'); span.textContent = 'SmartCRM';
    ribbon.appendChild(span);
    document.body.appendChild(ribbon);
  }, logoHref);
}