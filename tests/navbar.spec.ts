import { expect, test } from "@playwright/test";

const menu = [
  "Home",
  "About",
  "Products",
  "Catalogue",
  "Global Presence",
  "Contact",
];

test("desktop navbar stays centered and sticky, and all six links navigate", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.locator("header.site-header");
  const nav = header.getByRole("navigation");
  await expect(header).toHaveCount(1);
  await expect(page.locator(".scroll-progress")).toHaveCount(0);
  await expect(nav.locator("a:not(.mobile-quote)")).toHaveText(menu);
  await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  for (const width of [806, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const box = (await nav.boundingBox())!;
    const logo = (await header.locator(".brand-link").boundingBox())!;
    const quote = (await header.locator(".header-quote").boundingBox())!;
    expect(box.x + box.width / 2).toBeCloseTo(width / 2, 0);
    expect(logo.x + logo.width).toBeLessThan(box.x);
    expect(box.x + box.width).toBeLessThan(quote.x);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }

  await page.mouse.wheel(0, 1100);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
  expect((await header.boundingBox())?.y).toBe(0);
  await expect(header).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(page.locator(".scroll-progress")).toHaveCount(0);
  await nav.getByRole("link", { name: "Home" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  for (const [name, path] of [
    ["About", "/about"],
    ["Products", "/products"],
    ["Catalogue", "/collections"],
    ["Contact", "/contact"],
  ]) {
    const link = nav.getByRole("link", { name, exact: true });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(link).toHaveAttribute("aria-current", "page");
  }

  const globalPresence = nav.getByRole("link", { name: "Global Presence" });
  await globalPresence.click();
  await expect(page).toHaveURL(/\/#global-presence$/);
  await expect(globalPresence).toHaveAttribute("aria-current", "location");
  await expect
    .poll(async () =>
      Math.round(
        (await page.locator("#global-presence").boundingBox())!.y -
          (await header.boundingBox())!.height,
      ),
    )
    .toBeGreaterThanOrEqual(0);
  await nav.getByRole("link", { name: "Home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(nav.getByRole("link", { name: "Home" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await page.goBack();
  await expect(globalPresence).toHaveAttribute("aria-current", "location");
});

test("mobile navbar shows every link, closes with Escape and returns home", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  const header = page.locator("header.site-header");
  const nav = header.getByRole("navigation", { includeHidden: true });
  const toggle = header.locator(".menu-toggle");
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav.locator("a:not(.mobile-quote)")).toHaveText(menu);
  for (const name of menu)
    await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(nav).toBeHidden();
  await toggle.click();
  await nav.getByRole("link", { name: "Global Presence" }).click();
  await expect(nav).toBeHidden();
  await expect(page).toHaveURL(/\/#global-presence$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
  expect((await header.boundingBox())?.y).toBe(0);
  await toggle.click();
  await nav.getByRole("link", { name: "Home" }).click();
  await expect(nav).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  await expect(header).toHaveCount(1);
  await expect(page.locator(".scroll-progress")).toHaveCount(0);
});
