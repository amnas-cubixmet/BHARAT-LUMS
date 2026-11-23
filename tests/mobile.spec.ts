import { expect, test, type Page } from "@playwright/test";
import { catalogueCategories, products } from "../src/lib/catalogue";
import { countries } from "../src/lib/global-presence";

const viewports = [
  [320, 568], [375, 667], [390, 844], [430, 932], [540, 800], [541, 800],
  [568, 320], [650, 850], [651, 850], [667, 375], [768, 1024], [805, 680],
  [806, 680], [844, 390], [900, 760], [901, 760], [980, 780], [981, 780],
  [1024, 768], [1366, 768], [1920, 1080],
] as const;

const detailPath = "/products/led-street-light";
const routes = ["/about", "/products", detailPath, "/contact", "/request-quote", "/portfolio"];

async function openPage(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("main h1")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

async function expectPageFits(page: Page) {
  const { width, content, background } = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    background: getComputedStyle(document.body).backgroundColor,
  }));
  expect(content).toBeLessThanOrEqual(width + 1);
  expect(background).toBe("rgb(0, 0, 0)");
}

for (const [width, height] of viewports) {
  test(`layout and navigation at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await openPage(page, "/");
    await expectPageFits(page);
    const header = page.locator(".site-header");
    await expect(header).toHaveCount(1);
    await expect(header).toHaveCSS("position", "sticky");
    const menu = header.getByRole("button", { name: "Open menu" });
    const nav = header.getByRole("navigation", { name: "Main navigation" });
    if (width <= 805) {
      await expect(nav).toBeHidden();
      await menu.click();
      await expect(menu).toHaveCount(0);
      await expect(header.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
      await expect(nav).toBeVisible();
      for (const link of await nav.getByRole("link").all()) {
        expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
      }
      const quote = nav.getByRole("link", { name: "Request a quote" });
      await quote.scrollIntoViewIfNeeded();
      await expect(quote).toBeInViewport();
      await page.keyboard.press("Escape");
      await expect(nav).toBeHidden();
      await expect(menu).toBeFocused();
      await menu.click();
    }
    await expect(nav.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Global Presence" }).click();
    await expect(page).toHaveURL(/#global-presence$/);
    await expect(page.locator('.main-nav a[href="/#global-presence"]')).toHaveAttribute("aria-current", "location", { timeout: 10000 });
    if (width <= 805) await expect(nav).toBeHidden();
    expect(Math.abs((await header.boundingBox())?.y ?? Infinity)).toBeLessThan(2);

    const map = page.getByRole("group", { name: "Countries on the map" });
    await expect(map.getByRole("button")).toHaveCount(8);
    const details = page.locator("#presence-country-details");
    for (const country of countries) {
      const marker = map.getByRole("button", { name: country.name, exact: true });
      await marker.click();
      await expect(marker).toHaveAttribute("aria-pressed", "true");
      await expect(details.getByRole("heading")).toHaveText(country.name);
    }
    await page.getByRole("button", { name: "Return to India" }).click();
    await expect(details.getByRole("heading")).toHaveText("India");

    if (width <= 805) await menu.click();
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).not.toHaveURL(/#global-presence$/);
    await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(0);
    const heroTitle = page.locator("main h1");
    await expect(heroTitle).toContainText(/Light up.*the future\./i);
    const heroBounds = await heroTitle.evaluate((title) =>
      [...title.children].map((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        const box = range.getBoundingClientRect();
        return [box.left, box.right];
      }),
    );
    for (const [left, right] of heroBounds) {
      expect(left).toBeGreaterThanOrEqual(0);
      expect(right).toBeLessThanOrEqual(width + 1);
    }
    const explore = page.getByRole("link", { name: "Explore Products", exact: true });
    const catalogue = page.getByRole("link", { name: "Request Catalogue", exact: true });
    await expect(explore).toHaveAttribute("href", "/products");
    await expect(catalogue).toHaveAttribute("href", "/request-quote?catalogue=1");
    await expect(page.getByTestId("streetlight-stage")).toBeInViewport();
    await expect(explore).toBeInViewport({ ratio: 1 });
    await expect(catalogue).toBeInViewport({ ratio: 1 });
    const light = page.getByRole("button", { name: "Streetlight power" });
    await light.click();
    await expect(light).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("slider", { name: "Brightness" })).toBeDisabled();
    await light.click();
    await expect(light).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Next category" }).click();
    await page.getByRole("button", { name: "Previous category" }).click();
    for (const route of routes) {
      await openPage(page, route);
      await expectPageFits(page);
      if (route === "/about") {
        await expect(page.getByRole("img", { name: /conference table/ })).toBeVisible();
      } else if (route === "/products") {
        await expect(page.locator(".collection-card-link")).toHaveCount(10);
        await page.getByRole("searchbox", { name: "Search products" }).fill("warehouse");
        await expect(page.locator(".collection-card-link")).toHaveCount(1);
        await page.getByRole("button", { name: "Clear filters" }).click();
        await page.getByRole("combobox", { name: "Category" }).selectOption("led-street-lights");
        await expect(page.locator(".collection-card-link")).toHaveAttribute("href", detailPath);
      } else if (route === detailPath) {
        await page.getByRole("button", { name: "Show detail crop" }).click();
        await page.getByRole("button", { name: "Open full-size fixture image" }).click();
        const gallery = page.getByRole("dialog", { name: "Detail crop" });
        await expect(gallery).toBeVisible();
        await expect(gallery.getByRole("button", { name: "Close fixture image" })).toBeInViewport({ ratio: 1 });
        await gallery.getByRole("button", { name: "Magnify fixture" }).click();
        await page.keyboard.press("Escape");
        await expect(gallery).toBeHidden();
      } else if (route === "/contact" || route === "/request-quote") {
        const form = page.getByRole("form", { name: "Project enquiry" });
        await expect(form.getByRole("textbox", { name: "Full name" })).toHaveAttribute("placeholder", "Full name *");
        if (width <= 1024) await expect(form.getByRole("textbox", { name: "Full name" })).toHaveCSS("font-size", "16px");
        await form.getByRole("button", { name: "Prepare enquiry draft" }).click();
        await expect(form.getByText("Enter your full name.")).toBeVisible();
      }
    }
    expect(errors).toEqual([]);
  });
}

test("catalogue routes, gallery assets and enquiry drafts", async ({ page, request }) => {
  await openPage(page, "/products");
  for (const item of products) {
    await expect(page.locator(`.collection-card-link[href="/products/${item.slug}"]`)).toHaveCount(1);
    await openPage(page, `/products/${item.slug}`);
    await expect(page.locator("main h1")).toHaveText(item.name);
    await expect(page.getByRole("button", { name: "Open full-size fixture image" })).toBeVisible();
    for (const image of item.images) {
      expect((await request.get(image.src)).ok()).toBeTruthy();
    }
    const fixture = page.getByRole("region", { name: "Fixture details" });
    await expect(fixture.getByRole("link", { name: "Request a quote" })).toHaveAttribute("href", `/request-quote?collection=${item.categories[0]}`);
    await openPage(page, "/products");
  }
  for (const category of catalogueCategories) {
    await openPage(page, `/products?category=${category.slug}`);
    await expect(page.locator(".collection-card")).toHaveCount(1);
    await expect(page.locator(".collection-card h3")).toHaveText(category.name);
  }
  expect((await request.get("/catalogue")).status()).toBe(404);
  expect((await request.get("/collections")).status()).toBe(404);
  expect((await request.get("/products/suspended-linear")).status()).toBe(404);
  await openPage(page, "/request-quote?collection=led-street-lights");
  const form = page.getByRole("form", { name: "Project enquiry" });
  await expect(form.getByRole("textbox", { name: "Product interest" })).toHaveValue("LED Street Lights");
  await form.getByRole("textbox", { name: "Full name" }).fill("Responsive QA");
  await form.getByRole("textbox", { name: "Email address" }).fill("test@example.com");
  await form.getByRole("textbox", { name: "Message" }).fill("Synthetic responsive audit enquiry.");
  await form.getByRole("button", { name: "Prepare enquiry draft" }).click();
  const draft = form.getByRole("link", { name: "Open email app" });
  await expect(draft).toHaveAttribute("href", /mailto:suhail@bharatlums\.in/);
  expect(new URL((await draft.getAttribute("href"))!).searchParams.get("body")).toContain("Synthetic responsive audit enquiry.");
  await expect(form.getByRole("link", { name: "Open WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\//);
});

test("reduced motion and fallback on mobile", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "Chromium project exercises the forced WebGL fallback.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement, type: string, ...options: unknown[]) {
        return type.startsWith("webgl") ? null : Reflect.apply(original, this, [type, ...options]);
      },
    });
  });
  await openPage(page, "/");
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "false");
  await expect(stage.locator("img")).toBeVisible();
  await expect(page.locator("#catalogue-slider-track")).toHaveCSS("scroll-behavior", "auto");
  const indiaMap = page.getByRole("img", { name: "Regional map with India highlighted" });
  await expect(indiaMap).toBeVisible();
  await page.getByRole("button", { name: "Oman", exact: true }).click();
  await expect(page.getByRole("img", { name: "Regional map with Oman highlighted" })).toBeVisible();
});

test("WebGL streetlight and globe on a touch viewport", async ({ page, browserName }, testInfo) => {
  test.skip(browserName !== "chromium", "Touch gestures use Chromium's emulation protocol.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const webgl = await page.evaluate(() => {
    const context = document.createElement("canvas").getContext("webgl2");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(context);
  });
  test.skip(!webgl, "This browser cannot create a WebGL2 context.");

  await openPage(page, "/");
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "true", { timeout: 20000 });
  await expect(stage.locator("canvas")).toBeInViewport();
  const power = page.getByRole("button", { name: "Streetlight power" });
  await power.click();
  await expect(power).toHaveAttribute("aria-pressed", "false");
  await power.click();
  await expect(power).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: testInfo.outputPath("webgl-streetlight.png") });

  const globe = page.getByTestId("presence-canvas");
  await page.locator("[data-presence-stage]").scrollIntoViewIfNeeded();
  await expect(globe.locator("canvas")).toBeVisible({ timeout: 20000 });
  await expect(page.getByRole("img", { name: /Regional map/ })).toHaveCount(0);
  await expect(globe.locator("canvas")).toHaveCSS("touch-action", "pan-y");

  const element = (await globe.boundingBox())!;
  const client = await page.context().newCDPSession(page);
  const x = Math.round(element.x + element.width / 2);
  const y = Math.round(element.y + element.height / 2);
  const touch = (type: "touchStart" | "touchMove" | "touchEnd", touchPoints: { x: number; y: number }[]) =>
    client.send("Input.dispatchTouchEvent", { type, touchPoints });
  const before = await globe.screenshot();
  await touch("touchStart", [{ x, y }]);
  await touch("touchMove", [{ x: x - 35, y }]);
  await touch("touchMove", [{ x: x - 80, y }]);
  await touch("touchEnd", []);
  await expect.poll(async () => before.equals(await globe.screenshot())).toBe(false);

  const scrollBefore = await page.evaluate(() => scrollY);
  await touch("touchStart", [{ x, y }]);
  await touch("touchMove", [{ x, y: y - 45 }]);
  await touch("touchMove", [{ x, y: y - 100 }]);
  await touch("touchEnd", []);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scrollBefore + 10);
  await page.getByRole("button", { name: "Oman", exact: true }).click();
  await expect(page.locator("#presence-country-details h3")).toHaveText("Oman");
  await globe.screenshot({ path: testInfo.outputPath("webgl-globe.png") });
  await client.detach();
});
