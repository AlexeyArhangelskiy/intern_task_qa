
import { chromium, Browser, Page } from 'playwright';


describe('Website counters', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  }, 10000);

  afterAll(async () => {
    await browser.close();
  }, 10000);


  test('Counters display correctly', async () => {

    await page.route('https://www.avito.ru/web/1/charity/ecoImpact/init', (route) => {
        route.fulfill({
            body: JSON.stringify(require('./test_1.json')),
        });
    });


    await page.goto('https://www.avito.ru/avito-care/eco-impact');


    const co2Counter = '.desktop-impact-items-F7T6E > div:nth-child(2)';
    const waterCounter = '.desktop-impact-items-F7T6E > div:nth-child(4)';
    const treesCounter = '.desktop-impact-items-F7T6E > div:nth-child(6)';

    const countersSelectors = [co2Counter, waterCounter, treesCounter];

    for (let index = 0; index < countersSelectors.length; index++) {
      const counterSelector = countersSelectors[index];
      const screenshotPath = `./output/counter_${index + 1}.png`;
      // Создаем скриншот текущего счетчика
      await captureCounterScreenshot(page, counterSelector, screenshotPath);
    }
    });
});

async function captureCounterScreenshot(page: Page, counterSelector: string, screenshotPath: string) {
  const counterElement = await page.$(counterSelector);
  if (counterElement) {
    await counterElement.screenshot({ path: screenshotPath });
  } else {
    console.error(`Element with selector ${counterSelector} not found.`);
  }
}
