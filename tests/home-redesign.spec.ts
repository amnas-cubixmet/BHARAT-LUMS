import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("3D streetlight powers on and off, dims, and keeps navigation usable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /light up\s*the future\./i,
  );
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "true", {
    timeout: 20_000,
  });
  const canvas = stage.locator("canvas");
  const illuminated = await canvas.screenshot();
  const power = page.getByRole("button", { name: "Streetlight power" });
  const brightness = page.getByRole("slider", { name: "Brightness" });
  await power.click();
  await expect(power).toHaveAttribute("aria-pressed", "false");
  await expect(brightness).toBeDisabled();
  await expect
    .poll(async () => (await canvas.screenshot()).equals(illuminated))
    .toBe(false);
  await power.click();
  await brightness.focus();
  await page.keyboard.press("Home");
  await expect(brightness).toHaveValue("0");
  await page.keyboard.press("End");
  await expect(brightness).toHaveValue("100");
  for (const [name, href] of [
    ["About", "/about"],
    ["Products", "/products"],
    ["Catalogue", "/collections"],
    ["Global Presence", "/#global-presence"],
    ["Contact", "/contact"],
  ]) {
    await expect(
      page.getByRole("navigation").getByRole("link", { name, exact: true }),
    ).toHaveAttribute("href", href);
  }
  await page
    .getByRole("link", { name: "Explore Products", exact: true })
    .click();
  await expect(page).toHaveURL(/#featured$/);
  await expect(
    page.getByRole("heading", { name: "Built to light the way." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("phone and tablet layouts fit, and the fallback keeps controls and FAQ accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const native = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        kind: string,
        settings?: CanvasRenderingContext2DSettings,
      ) {
        return kind.startsWith("webgl")
          ? null
          : native.call(this, kind as "2d", settings);
      },
    });
  });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 850 });
    await page.goto("/");
    const stage = page.getByTestId("streetlight-stage");
    await expect(stage.locator("img")).toHaveJSProperty("complete", true);
    expect(
      await stage
        .locator("img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
    await expect(stage.locator("canvas")).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Contact" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  const question = page.getByRole("button", {
    name: "Can I download the product catalogue?",
  });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(question).toHaveAttribute("aria-expanded", "true");
  await expect(
    page
      .locator("#faq")
      .getByText("There is currently no public download.", { exact: false }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page })
    .include("#faq")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("motion-enabled homepage hydrates, rotates and reacts to the pointer", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const stage = page.getByTestId("streetlight-stage");
  await expect(stage).toHaveAttribute("data-ready", "true", {
    timeout: 20_000,
  });
  const canvas = stage.locator("canvas");
  const entrance = await canvas.screenshot();
  await expect
    .poll(async () => (await canvas.screenshot()).equals(entrance))
    .toBe(false);
  await page.mouse.move(1275, 500);
  const pointer = await canvas.screenshot();
  await page.mouse.move(200, 210);
  await expect
    .poll(async () => (await canvas.screenshot()).equals(pointer))
    .toBe(false);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.locator("header .brand-link").click();
  await expect(stage).toHaveAttribute("data-ready", "true", {
    timeout: 20_000,
  });
  expect(errors).toEqual([]);
});
