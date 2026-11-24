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
        // Let Next.js prefetches finish before replacing the WebKit document.
        await page.waitForLoadState("networkidle");
      }

      await page.goto("/", { waitUntil: "domcontentloaded" });
      const nav = page.getByRole("navigation", { name: "Main navigation" });
      await page.getByRole("button", { name: "Open menu" }).click();
      await expect(nav).toBeVisible();
      await nav.getByRole("link", { name: "Products", exact: true }).click();
      await expect(page).toHaveURL(/\/products$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("LED lighting catalogue.");
      await page.waitForLoadState("networkidle");
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

test("iPhone homepage motion remains active without a coarse pointer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const matchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) =>
      query === "(any-pointer: coarse) and (max-width: 1024px)"
        ? matchMedia("not all")
        : matchMedia(query);
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-touch-home-motion]")).toHaveCount(3);
  const stage = page.getByTestId("streetlight-stage");
  const spotlight = stage.locator('[class*="_heroIllumination"]');
  await expect(spotlight).toHaveCSS("transition-duration", "0.35s");
  await page.getByRole("button", { name: "Streetlight power" }).click();
  await expect(spotlight).toHaveCSS("opacity", "0");

  await page.evaluate(() => window.scrollTo(0, 240));
  await expect.poll(() => stage.evaluate((element) =>
    parseFloat(element.style.getPropertyValue("--hero-scroll-y")) || 0,
  )).toBeGreaterThan(0);
  await expect(page.locator("#catalogue-slider-track")).toHaveCSS("scroll-behavior", "smooth");

  await page.getByRole("button", { name: "Oman", exact: true }).click();
  await expect(page.locator("#presence-country-details h3")).toHaveText("Oman");
});
