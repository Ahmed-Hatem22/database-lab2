const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Edge for screenshots...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Screenshot 1: Register page with error messages
  console.log('Capturing: register-errors.png...');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
  // Click submit to trigger client-side validation errors
  await page.click('#registerSubmitBtn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'register-errors.png') });

  // 2. Screenshot 2: Login page
  console.log('Capturing: login.png...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'login.png') });

  // 3. Screenshot 3: Study tasks list with some to-dos (one done)
  console.log('Capturing: study-tasks-list.png...');
  // Log in as test user
  await page.type('#email', 'sara@mail.com');
  await page.type('#password', 'password123');
  await page.click('#loginSubmitBtn');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'study-tasks-list.png') });

  // 4. Screenshot 4: Phone-sized window (360px wide)
  console.log('Capturing: mobile-view.png (360px wide)...');
  await page.setViewport({ width: 360, height: 740, isMobile: true });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'mobile-view.png') });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
