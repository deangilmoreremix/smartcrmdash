import { Page } from '@playwright/test';

export async function spotlight(page: Page, selector: string, note = '') {
  await page.addStyleTag({ content: `
    .__spot__ { position: fixed; inset: 0; pointer-events: none; z-index: 999999; }
    .__spot__ .hole { position: absolute; box-shadow: 0 0 0 9999px rgba(0,0,0,.37); border-radius: 14px; outline: 3px solid #fff; }
    .__spot__ .label { position: fixed; bottom: 24px; left: 24px; background: rgba(0,0,0,.9); color: #fff; padding: 10px 14px; border-radius: 10px; font: 500 14px/1.35 Inter, system-ui; max-width: 560px; }
  `});
  try {
    const box = await page.locator(selector).first().boundingBox({ timeout: 5000 });
    if (!box) return;
    await page.evaluate(({ box, note }) => {
      const prev = document.querySelector('.__spot__'); if (prev) prev.remove();
      const wrap = document.createElement('div'); wrap.className = '__spot__';
      const hole = document.createElement('div'); hole.className = 'hole';
      hole.style.left = `${box.x - 8}px`; hole.style.top = `${box.y - 8}px`;
      hole.style.width = `${box.width + 16}px`; hole.style.height = `${box.height + 16}px`;
      const label = document.createElement('div'); label.className = 'label'; label.textContent = note || '';
      wrap.appendChild(hole); wrap.appendChild(label); document.body.appendChild(wrap);
    }, { box, note });
  } catch (e) {
    console.log(`Element ${selector} not found for spotlight, continuing without it`);
  }
}

export async function clearSpotlight(page: Page) {
  await page.evaluate(() => document.querySelector('.__spot__')?.remove());
}