import { chromium, Browser, Page } from "playwright";

describe("Website counters", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  }, 20000);

  afterAll(async () => {
    await browser.close();
  }, 20000);

  const co2Counter = ".desktop-impact-items-F7T6E > div:nth-child(2)";
  const waterCounter = ".desktop-impact-items-F7T6E > div:nth-child(4)";
  const treesCounter = ".desktop-impact-items-F7T6E > div:nth-child(6)";
  const countersSelectors = [waterCounter, co2Counter, treesCounter];

  test("Counters display correctly", async () => {
    await page.goto("https://www.avito.ru/avito-care/eco-impact");

    for (let index = 0; index < countersSelectors.length; index++) {
      const counterSelector = countersSelectors[index];
      const screenshotPath = `./output/testcase1_${index + 1}.png`;
      await captureCounterScreenshot(page, counterSelector, screenshotPath);
    }
  });

  test("Test 2 change value correctly", async () => {
    await page.route(
      "https://www.avito.ru/web/1/charity/ecoImpact/init",
      (route) => {
        route.fulfill({
          body: JSON.stringify(require("./dataForTest/test_1.json")),
        });
      },
    );

    await page.goto("https://www.avito.ru/avito-care/eco-impact");

    for (let index = 0; index < countersSelectors.length; index++) {
      const counterSelector = countersSelectors[index];
      const screenshotPath = `./output/testcase2_${index + 1}.png`;
      await captureCounterScreenshot(page, counterSelector, screenshotPath);
    }
  });

  test("Test 3 change value correctly", async () => {
    await page.route(
      "https://www.avito.ru/web/1/charity/ecoImpact/init",
      (route) => {
        route.fulfill({
          body: JSON.stringify(require("./dataForTest/test_2.json")),
        });
      },
    );

    await page.goto("https://www.avito.ru/avito-care/eco-impact");

    for (let index = 0; index < countersSelectors.length; index++) {
      const counterSelector = countersSelectors[index];
      const screenshotPath = `./output/testcase3_${index + 1}.png`;
      await captureCounterScreenshot(page, counterSelector, screenshotPath);
    }
  });

  test("Test 4 value rounding", async () => {
    await page.route(
      "https://www.avito.ru/web/1/charity/ecoImpact/init",
      (route) => {
        route.fulfill({
          body: JSON.stringify(require("./dataForTest/test_3.json")),
        });
      },
    );

    await page.goto("https://www.avito.ru/avito-care/eco-impact");

    for (let index = 0; index < countersSelectors.length; index++) {
      const counterSelector = countersSelectors[index];
      const screenshotPath = `./output/testcase4_${index + 1}.png`;
      await captureCounterScreenshot(page, counterSelector, screenshotPath);
    }
  });
});

async function captureCounterScreenshot(
  page: Page,
  counterSelector: string,
  screenshotPath: string,
) {
  const counterElement = await page.$(counterSelector);
  if (counterElement) {
    await counterElement.screenshot({ path: screenshotPath });
  } else {
    console.error(`Element with selector ${counterSelector} not found.`);
  }
}
