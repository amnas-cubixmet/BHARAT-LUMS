import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { catalogueCategories, products } from "../src/lib/catalogue";

test("catalogue categories, search and every listing image work", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products");
  const cards = page.locator(".product-card");
  await expect(cards).toHaveCount(products.length);
  const sources = new Set<string>();
  for (const [index, product] of products.entries()) {
    const card = cards.nth(index);
    await expect(card.getByRole("heading")).toHaveText(product.name);
    const image = card.locator("img");
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
      .toBeGreaterThan(0);
    await expect(image).toHaveAttribute("alt", product.images[0].alt);
    const responsiveSrc = new URL(
      await image.evaluate((node: HTMLImageElement) => node.currentSrc),
    );
    const actualSrc =
      responsiveSrc.searchParams.get("url") ?? responsiveSrc.pathname;
    expect(actualSrc).toBe(product.images[0].src);
    sources.add(actualSrc);
    for (const view of product.images) {
      const response = await request.get(view.src);
      expect(response.ok(), view.src).toBe(true);
      expect(response.headers()["content-type"]).toContain("image/webp");
    }
    expect((await request.get(`/products/${product.slug}`)).ok()).toBe(true);
    if (product.status === "verified") {
      for (const path of [product.datasheet, product.catalogue]) {
        if (path)
          expect(existsSync(resolve("public", path.slice(1))), path).toBe(true);
      }
    }
  }
  expect(sources.size).toBe(products.length);
  const category = page.getByRole("combobox", { name: "Category" });
  for (const item of catalogueCategories) {
    await category.selectOption(item.slug);
    await expect(cards).toHaveCount(
      products.filter((product) => product.categories.includes(item.slug))
        .length,
    );
  }
  await category.selectOption("");
  await page
    .getByRole("textbox", { name: "Search products" })
    .fill("nonexistent fixture 000");
  await expect(
    page.getByText("No fixtures match your search or filters."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("textbox", { name: "Search products" }).fill("magnetic");
  await expect(cards).toHaveCount(1);
  await cards.first().getByRole("button", { name: "Quick preview" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "Magnetic Spot Track" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  if (
    !products.some(
      (item) => item.status === "verified" && item.wattages?.length,
    )
  ) {
    await expect(page.getByRole("combobox", { name: "Wattage" })).toHaveCount(
      0,
    );
  }
  expect(errors).toEqual([]);
});

test("fixture detail supports thumbnails, zoom, quotes and WhatsApp handoff", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products/led-street-light");
  await expect(
    page.getByRole("heading", { name: "LED Street Light", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show detail crop" }).click();
  await expect(
    page.getByRole("button", { name: "Show detail crop" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Open full-size fixture image" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Detail crop" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Magnify fixture" }).click();
  await expect(
    dialog.getByRole("button", { name: "Magnify fixture" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Related fixtures" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download datasheet" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Download catalogue" }),
  ).toHaveCount(0);
  await context.route("https://wa.me/**", (route) =>
    route.fulfill({ body: "WhatsApp handoff" }),
  );
  const opened = context.waitForEvent("page");
  await page.getByRole("link", { name: "WhatsApp enquiry" }).click();
  const whatsapp = await opened;
  await whatsapp.waitForLoadState();
  const url = new URL(whatsapp.url());
  expect(url.origin).toBe("https://wa.me");
  expect(url.pathname).toMatch(/^\/91\d{10}$/);
  expect(url.searchParams.get("text")).toContain("LED Street Light");
  await whatsapp.close();
  await page
    .getByRole("region", { name: "Fixture details" })
    .getByRole("link", { name: "Request a quote", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Product interest" }),
  ).toHaveValue("LED Street Light");
});

test("catalogue fits phone and tablet widths and handles failed images", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/_next/image?**", (route) => {
    const src = new URL(route.request().url()).searchParams.get("url");
    return src === "/images/products/flood-light.webp"
      ? route.abort()
      : route.continue();
  });
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/products");
    await expect(
      page.getByText("Image unavailable", { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page
      .getByRole("combobox", { name: "Category" })
      .selectOption("led-panel-lights");
    await page
      .getByRole("heading", { name: "LED Flat Panel" })
      .getByRole("link")
      .click();
    await expect(
      page.getByRole("heading", { level: 1, name: "LED Flat Panel" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
});
