import { expect, test } from "@playwright/test";

// Playwright WebKit mobile emulation is not a physical iPhone or iOS Safari.
const iphoneWidths = [320, 375, 390, 430] as const;
const routes = [
  "/",
  "/about",
  "/products",
  "/products/led-street-light",
  "/portfolio",
  "/contact",
  "/request-quote",
];

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  for (const width of iphoneWidths) {
    test(`WebKit iPhone ${width}px with Reduce Motion ${reducedMotion}`, async ({ page }, testInfo) => {
      test.slow();
      await page.setViewportSize({ width, height: 844 });
      await page.emulateMedia({ reducedMotion });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));

      for (const route of routes) {
        const response = await page.goto(route, { waitUntil: "domcontentloaded" });
        expect(response?.status()).toBe(200);
        await expect(page.locator("main h1")).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(dimensions.content, `horizontal overflow on ${route} at ${width}px`)
          .toBeLessThanOrEqual(dimensions.viewport + 1);
      }

      await page.goto("/", { waitUntil: "domcontentloaded" });
      const nav = page.getByRole("navigation", { name: "Main navigation" });
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(nav).toBeVisible();
      await nav.getByRole("link", { name: "Products", exact: true }).click();
      await expect(page).toHaveURL(/\/products$/);
      await page.goto("/", { waitUntil: "domcontentloaded" });

      const track = page.locator("#catalogue-slider-track");
      await track.scrollIntoViewIfNeeded();
      await expect(track).toHaveCSS("scroll-behavior", "smooth");
      const before = await track.evaluate((element) => element.scrollLeft);
      await page.getByRole("button", { name: "Next category" }).click();
      await expect.poll(() => track.evaluate((element) => element.scrollLeft))
        .not.toBe(before);

      const countries = page.getByRole("group", { name: "Countries on the map" });
      await countries.getByRole("button", { name: "Oman", exact: true }).click();
      await expect(page.locator("#presence-country-details h3")).toHaveText("Oman");
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: testInfo.outputPath(`iphone-webkit-${width}-${reducedMotion}.png`),
      });
      expect(errors).toEqual([]);
    });
  }
}
