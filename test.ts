import { chromium, Browser, Page } from "playwright";

describe("Website counters", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  }, 10000);

  afterAll(async () => {
    await browser.close();
  }, 10000);

  const countersSelectors = [
    ".desktop-impact-items-F7T6E > div:nth-child(2)",
    ".desktop-impact-items-F7T6E > div:nth-child(4)",
    ".desktop-impact-items-F7T6E > div:nth-child(6)",
  ];

  const testData = [
    "./dataForTest/test_1.json",
    "./dataForTest/test_2.json",
    "./dataForTest/test_3.json",
  ];

  async function loadData(dataPath: string) {
    await page.route(
      "https://www.avito.ru/web/1/charity/ecoImpact/init",
      (route) => {
        route.fulfill({
          body: JSON.stringify(require(dataPath)),
        });
      },
    );

    await page.goto("https://www.avito.ru/avito-care/eco-impact");
  }

  async function captureScreenshots(
    page: Page,
    selectors: string[],
    nameCase: string,
  ) {
    for (let index = 0; index < selectors.length; index++) {
      const counterSelector = selectors[index];
      const screenshotPath = `./output/${nameCase}_${index + 1}.png`;
      await captureCounterScreenshot(page, counterSelector, screenshotPath);
    }
  }

  test("Test 1 display correctly", async () => {
    await page.goto("https://www.avito.ru/avito-care/eco-impact");
    await captureScreenshots(page, countersSelectors, "testcase1");
  }, 10000);

  test("Test 2 change value correctly", async () => {
    await loadData(testData[0]);
    await captureScreenshots(page, countersSelectors, "testcase2");
  }, 10000);

  test("Test 3 change value correctly", async () => {
    await loadData(testData[1]);
    await captureScreenshots(page, countersSelectors, "testcase3");
  }, 10000);

  test("Test 4 value rounding", async () => {
    await loadData(testData[2]);
    await captureScreenshots(page, countersSelectors, "testcase4");
  }, 10000);
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
