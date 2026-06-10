import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

// Force all animated content visible
await page.evaluate(() => {
  document.querySelectorAll('.fade-in').forEach(el => el.classList.add('in'));
  document.querySelectorAll('[data-step]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
  const line = document.getElementById('steps-line');
  if (line) line.style.transform = 'scaleY(1)';
  const ringFg = document.getElementById('ring-fg');
  if (ringFg) ringFg.style.strokeDashoffset = String(879 - 0.78 * 879);
  const ringNum = document.getElementById('ring-num');
  if (ringNum) ringNum.textContent = '78';
});
await new Promise(r => setTimeout(r, 800));

const snap = async (selector, name) => {
  const el = await page.$(selector);
  if (!el) { console.log('not found:', selector); return; }
  const box = await el.boundingBox();
  await page.screenshot({ path: `temporary screenshots/${name}.png`, clip: box });
  console.log('saved', name);
};

await snap('section.bento', 'bento');
await snap('section.phones', 'phones');
await snap('section.steps', 'steps');
await snap('section.cta-section', 'cta');
await snap('footer', 'footer');

await browser.close();
