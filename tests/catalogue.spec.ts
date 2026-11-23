import { expect, test } from "@playwright/test";
import {
  catalogueCategories,
  products,
  publishedProducts,
} from "../src/lib/catalogue";

test("lighting categories are searchable and unverified products stay in draft", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products");
  expect(products.length).toBeGreaterThan(0);
  for (const product of products) {
    expect((await request.get(`/products/${product.slug}`)).status()).toBe(
      product.status === "verified" ? 200 : 404,
    );
  }
  if (!publishedProducts.length) {
    await expect(page.locator(".product-card")).toHaveCount(0);
    const cards = page
      .getByRole("region", { name: "Browse fixtures" })
      .locator(".media-card");
    await expect(cards).toHaveCount(catalogueCategories.length);
    for (const [index, item] of catalogueCategories.entries()) {
      const image = cards.nth(index).locator("img");
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((node: HTMLImageElement) => node.naturalWidth),
        )
        .toBeGreaterThan(0);
      expect(
        new URL(
          await image.evaluate((node: HTMLImageElement) => node.currentSrc),
        ).searchParams.get("url"),
      ).toBe(`/images/${item.image}.webp`);
    }
    await page.getByRole("textbox", { name: "Search products" }).fill("street");
    await expect(cards).toHaveCount(1);
    await expect(cards.getByRole("heading")).toHaveText("LED Street Lights");
    await page
      .getByRole("combobox", { name: "Category" })
      .selectOption("floodlights");
    await expect(
      page.getByText("No fixtures or categories match your search or filters."),
    ).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await page
      .getByRole("combobox", { name: "Category" })
      .selectOption("led-panel-lights");
    await cards
      .getByRole("heading", { name: "LED Panel Lights" })
      .getByRole("link")
      .click();
    await expect(
      page.getByRole("heading", { level: 1, name: "LED Panel Lights" }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: "Enquire about this collection" })
      .click();
    await expect(
      page.getByRole("textbox", { name: "Product interest" }),
    ).toHaveValue("LED Panel Lights");
  }
});

test("catalogue request pre-fills the enquiry and portfolio links remain valid", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .getByRole("link", { name: "Request Catalogue", exact: true })
    .click();
  await expect(
    page.getByRole("textbox", { name: "Product interest" }),
  ).toHaveValue("LED product catalogue");
  await page.goto("/portfolio/after-hours");
  await page
    .getByRole("link", { name: /explore lighting collection|view fixture/i })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
    "Page not found.",
  );
  for (const path of [
    "/about",
    "/contact",
    "/light-studio",
    "/collections",
    "/portfolio",
  ]) {
    expect((await page.goto(path))?.status()).toBe(200);
  }
});
