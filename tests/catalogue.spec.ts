import { expect, test } from "@playwright/test";
import { catalogueCategories, legacyCategories } from "../src/lib/catalogue";

test("removed collection URLs return 404 without redirects", async ({ request }) => {
  for (const path of [
    "/collections",
    ...[...catalogueCategories, ...legacyCategories].map(
      ({ slug }) => `/collections/${slug}`,
    ),
    "/collections/unknown/nested",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
  }
});

for (const width of [390, 1440]) {
  test(`the product catalogue and category enquiries work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect((await page.goto("/products?category=floodlights"))?.status()).toBe(200);
    const browser = page.getByRole("region", { name: "Browse fixtures" });
    const category = browser.getByRole("combobox", { name: "Category" });
    await expect(category).toHaveValue("floodlights");
    await expect(browser.getByRole("heading", { name: "LED Street Lights" })).toHaveCount(0);

    const enquiry = browser.getByRole("link", { name: "Enquire about LED Flood Lights" });
    const image = enquiry.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.naturalWidth)).toBeGreaterThan(0);

    await enquiry.click();
    await expect(page).toHaveURL(/\/request-quote\?collection=floodlights$/);
    await expect(page.getByRole("textbox", { name: "Product interest" })).toHaveValue("LED Flood Lights");

    await page.getByRole("contentinfo").getByRole("link", { name: "Product Catalogue" }).click();
    await expect(page).toHaveURL(/\/products$/);
    await expect(category).toHaveValue("");
    await expect(browser.getByRole("heading", { name: "LED Street Lights" })).toBeVisible();
    await expect(page.locator('a[href^="/collections"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

for (const path of ["/", "/about", "/contact", "/portfolio", "/portfolio/the-quiet-residence", "/light-studio"]) {
  test(`no retired collection links on ${path}`, async ({ page }) => {
    expect((await page.goto(path))?.status()).toBe(200);
    await expect(page.locator('a[href^="/collections"]')).toHaveCount(0);
  });
}
