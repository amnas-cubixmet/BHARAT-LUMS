import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { collections, projects, publishedProducts } from "../src/lib/catalogue";

const routes = [
  "/",
  "/about",
  "/contact",
  "/products",
  "/collections",
  "/portfolio",
  "/light-studio",
  "/request-quote",
  ...collections.map(({ slug }) => `/collections/${slug}`),
  ...projects.map(({ slug }) => `/portfolio/${slug}`),
  ...publishedProducts.map(({ slug }) => `/products/${slug}`),
];

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`all public pages use black and white at ${viewport.width}px`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    for (const route of routes) {
      expect((await page.goto(route))?.status(), route).toBe(200);
      await page.locator("main h1").waitFor({ state: "attached" });
      await page.locator(".footer-bottom").waitFor({ state: "attached" });
      const colors = await page.evaluate(() => {
        const heading = document.querySelector("main h1")!;
        const header = document.querySelector("header.site-header")!;
        const footer = document.querySelector(".footer-bottom")!;
        return {
          body: getComputedStyle(document.body).backgroundColor,
          nav: getComputedStyle(header).backgroundColor,
          navLink: getComputedStyle(header.querySelector("nav a")!).color,
          primary: getComputedStyle(heading).color,
          footer: getComputedStyle(footer).color,
          overflows: document.documentElement.scrollWidth > window.innerWidth,
        };
      });
      expect(colors, route).toEqual({
        body: "rgb(0, 0, 0)",
        nav: "rgb(0, 0, 0)",
        navLink: "rgb(255, 255, 255)",
        primary: "rgb(255, 255, 255)",
        footer: "rgb(255, 255, 255)",
        overflows: false,
      });
    }
    expect(errors).toEqual([]);
  });
}

test("homepage sections and outlined CTAs use the strict palette and remain accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page
    .getByRole("heading", { level: 1 })
    .locator("xpath=ancestor::section[1]");
  await expect(hero).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(
    hero.getByText("Advanced LED lighting solutions", { exact: false }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
  const quote = hero.getByRole("link", { name: "Get a Quote" });
  await expect(quote).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(quote).toHaveCSS("border-top-color", "rgb(255, 255, 255)");
  await quote.hover();
  await expect(quote).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(quote).toHaveCSS("color", "rgb(0, 0, 0)");
  await expect(page.locator("header .brand-logo")).toHaveAttribute(
    "src",
    /bharat-lums-white\.png/,
  );
  for (const section of ["#global-presence", "#featured", "#faq"]) {
    await expect(page.locator(section)).toHaveCSS(
      "background-color",
      "rgb(0, 0, 0)",
    );
    await expect(page.locator(section)).toHaveCSS("background-image", "none");
  }
  const presence = page.locator("#global-presence");
  const oman = presence.getByRole("button", { name: "Oman", exact: true });
  await oman.scrollIntoViewIfNeeded();
  await expect(
    presence.getByText("Interactive globe", { exact: true }),
  ).toBeVisible({ timeout: 20_000 });
  await oman.click();
  await expect(oman).toHaveAttribute("aria-pressed", "true");
  await expect(
    presence.getByTestId("presence-canvas").getByText("Oman", { exact: true }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page })
    .include("#faq")
    .include("header.site-header")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
