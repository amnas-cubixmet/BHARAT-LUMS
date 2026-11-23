import { expect, test } from "@playwright/test";

const categoryNames = [
  "LED Flood Lights",
  "LED Street Lights",
  "LED High Bay Lights",
  "LED Industrial Lights",
  "LED Commercial Lights",
  "LED Panel Lights",
  "LED Office Lights",
  "LED Outdoor Lights",
  "LED High Mast Lighting",
  "LED Warehouse Lighting"
] as const;

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`collections show only the LED categories at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/collections");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Professional LED Lighting.");
    const categories = page.getByRole("region", { name: "LED lighting categories" });
    const cards = categories.getByRole("article");
    await expect(cards.getByRole("heading")).toHaveText([...categoryNames]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);

    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      const image = card.locator("img");
      await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);
      const bounds = await card.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
  });
}

test("collection cards link to working category pages", async ({ page, request }) => {
  await page.goto("/collections");
  const categories = page.getByRole("region", { name: "LED lighting categories" });
  for (const name of categoryNames) {
    const href = await categories.getByRole("link", { name, exact: true }).getAttribute("href");
    expect(href).toMatch(/^\/collections\//);
    const response = await request.get(href!);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain(name);
  }
  expect((await request.get("/collections/linear-led-lighting")).ok()).toBe(true);
});
