import { expect, test } from "@playwright/test";

for (const width of [320, 360, 375, 390, 430, 768, 1024, 1440]) {
  test(`streetlight hero fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 700 ? 700 : 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    const hero = heading.locator("xpath=ancestor::section[1]");
    const stage = page.getByTestId("streetlight-stage");
    await expect(stage).toHaveAttribute("data-ready", "true");
    await expect(hero).toHaveCSS("background-color", "rgb(0, 0, 0)");
    for (const surface of ["html", "body"]) {
      await expect(page.locator(surface)).toHaveCSS("background-color", "rgb(0, 0, 0)");
    }
    await expect(heading).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(hero.getByRole("link", { name: "Get a Quote" })).toHaveCount(0);

    await page.evaluate(() => document.fonts.ready);
    const bounds = await hero.evaluate((section) => {
      const heading = section.querySelector("h1")!;
      const text = document.createRange();
      text.selectNodeContents(heading);
      const stage = section.querySelector("[data-hero-stage]")!;
      return {
        pageWidth: document.documentElement.scrollWidth,
        headingRight: text.getBoundingClientRect().right,
        stageTop: stage.getBoundingClientRect().top,
        stageRight: stage.getBoundingClientRect().right,
        linksBottom: Math.max(
          ...Array.from(section.querySelectorAll("a"), (link) =>
            link.getBoundingClientRect().bottom,
          ),
        ),
      };
    });
    expect(bounds.pageWidth).toBe(width);
    expect(bounds.headingRight).toBeLessThanOrEqual(width);
    expect(bounds.stageRight).toBeLessThanOrEqual(width);
    if (width <= 900) {
      expect(bounds.stageTop).toBeGreaterThanOrEqual(bounds.linksBottom);
    }
    expect(errors).toEqual([]);
  });
}

test("streetlight power updates the rendered diffuser with reduced motion", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 820 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "true");
  await page.addStyleTag({
    content: "[data-hero-stage] > :first-child { visibility: hidden; }",
  });
  const canvas = stage.locator("canvas");
  const power = page.getByRole("button", { name: "Streetlight power" });
  const brightness = page.getByRole("slider", { name: "Brightness" });
  const lit = await canvas.screenshot();

  await power.click();
  await expect(power).toHaveAttribute("aria-pressed", "false");
  await expect(brightness).toBeDisabled();
  await expect.poll(async () => (await canvas.screenshot()).equals(lit)).toBe(false);
  const unlit = await canvas.screenshot();

  await power.click();
  await expect(power).toHaveAttribute("aria-pressed", "true");
  await expect(brightness).toBeEnabled();
  await expect.poll(async () => (await canvas.screenshot()).equals(unlit)).toBe(false);

  await brightness.focus();
  await brightness.press("Home");
  await expect(brightness).toHaveValue("0");
  await expect.poll(async () => (await canvas.screenshot()).equals(unlit)).toBe(true);
});

test("streetlight fallback and hero links work without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value(this: HTMLCanvasElement, contextId: string, options?: unknown) {
        return contextId.startsWith("webgl")
          ? null
          : Reflect.apply(getContext, this, [contextId, options]);
      },
    });
  });
  await page.goto("/");
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect.poll(() => stage.locator("img").evaluate((image: HTMLImageElement) =>
    image.naturalWidth,
  )).toBeGreaterThan(0);

  await expect(page.getByRole("banner").getByRole("link", {
    name: "Request a quote",
  })).toBeVisible();
  await page.getByRole("link", { name: "Explore Products" }).click();
  await expect(page).toHaveURL(/#featured$/);
  await page.getByRole("link", { name: "Request Catalogue", exact: true }).click();
  await expect(page).toHaveURL(/\/request-quote\?catalogue=1$/);
  await expect(page.getByRole("textbox", { name: "Message" })).toHaveValue(
    "Please share the current Bharat Lums product catalogue.",
  );
});
