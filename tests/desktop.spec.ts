import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

function captureErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  return errors;
}

test("homepage accessibility, catalogue navigation and assets", async ({
  page,
}) => {
  const errors = captureErrors(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Light beyond/i }),
  ).toBeVisible();
  await expect(page.locator(".hero-art img")).toHaveJSProperty(
    "complete",
    true,
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  const carousel = page.getByRole("region", {
    name: "Featured project concepts",
  });
  await expect(
    page.getByRole("button", { name: "Previous projects" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next projects" }).click();
  await expect
    .poll(() => carousel.evaluate((track) => track.scrollLeft))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Previous projects" }).click();
  await expect(
    page.getByRole("button", { name: "Previous projects" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Explore our collections" }).click();
  await expect(page.locator(".media-card")).toHaveCount(16);
  await page
    .getByRole("link", { name: "Explore Linear LED Lighting", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Linear LED Lighting", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Suspended Linear", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("product search, category filters, quick preview, gallery and quote", async ({
  page,
}) => {
  const errors = captureErrors(page);
  await page.goto("/products");
  await page.getByRole("textbox", { name: "Search products" }).fill("magnetic");
  await expect(page.getByRole("status")).toHaveText("1 fixture");
  await page.getByRole("button", { name: "Quick preview" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Category", exact: true })
    .selectOption("pendant-lighting");
  await expect(
    page.getByText("No demonstration fixtures match your search."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page
    .getByRole("link", { name: "View Suspended Linear", exact: true })
    .click();
  await page.getByRole("button", { name: "Show view 2" }).click();
  await expect(
    page.getByRole("img", { name: /lighting concept, view 2/ }),
  ).toBeVisible();
  await page
    .getByRole("main")
    .getByRole("link", { name: "Request a quote", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Product interest")).toHaveValue(
    "Suspended Linear",
  );
  expect(errors).toEqual([]);
});

test("3D lighting updates pixels, camera controls work and configuration transfers", async ({
  page,
}) => {
  const errors = captureErrors(page);
  await page.goto("/light-studio");
  const canvas = page.locator(".studio-canvas canvas");
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  await expect(
    page.getByRole("switch", { name: "Fixture power" }),
  ).toBeChecked();
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Chromium can clear the drawing buffer between frames, so compare rendered screenshots.
  const visual = () => canvas.screenshot({ animations: "disabled" });
  const enabled = await visual();
  await page.getByRole("switch", { name: "Fixture power" }).click();
  await expect.poll(async () => (await visual()).equals(enabled)).toBe(false);
  const disabled = await visual();
  await page.getByRole("button", { name: "Rotate camera" }).click();
  await expect.poll(async () => (await visual()).equals(disabled)).toBe(false);
  await page.getByRole("button", { name: "Zoom camera" }).click();
  await page.getByRole("button", { name: "Reset camera" }).click();
  await page.getByRole("button", { name: /6500 K/ }).click();
  await page.getByRole("slider", { name: "Brightness" }).focus();
  await page.keyboard.press("End");
  await page.getByLabel("Arrangement").selectOption("Geometric");
  await page.getByLabel("Mounting").selectOption("Recessed");
  await page.getByRole("button", { name: "Aluminum" }).click();
  await page
    .getByRole("combobox", { name: "Environment", exact: true })
    .selectOption("Restaurant");
  await page.getByRole("link", { name: "Request this configuration" }).click();
  await expect(page.getByLabel("Message")).toHaveValue(
    /Restaurant · Geometric · Recessed · Aluminum · 6500 K · 100% brightness · Power off/,
  );
  expect(errors).toEqual([]);
});

test("2D fallback responds when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const native = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        kind: string,
        settings?: CanvasRenderingContext2DSettings,
      ) {
        if (kind === "webgl" || kind === "webgl2") return null;
        return native.call(this, kind as "2d", settings);
      },
    });
  });
  await page.goto("/light-studio");
  const fallback = page.getByTestId("flat-preview");
  await expect(fallback).toBeVisible();
  await expect(fallback.locator(".flat-fixture")).toHaveCount(3);
  await page.getByLabel("Arrangement").selectOption("Single");
  await expect(fallback.locator(".flat-fixture")).toHaveCount(1);
  await page.getByRole("switch", { name: "Fixture power" }).click();
  await expect(fallback).toHaveAttribute("aria-label", /power off/);
});

test("concept portfolio, project detail and not found", async ({
  page,
  request,
}) => {
  await page.goto("/portfolio");
  await page.getByRole("button", { name: "Residential" }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await page.getByRole("link", { name: "View The Quiet Residence" }).click();
  await expect(
    page.getByRole("heading", { name: "Lighting approach" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Related concepts." }),
  ).toBeVisible();
  expect((await request.get("/products/unknown-fixture")).status()).toBe(404);
});

test("enquiry validation, email draft and API fallback", async ({
  page,
  request,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Prepare email draft" }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await page.getByLabel("Full name").fill("Test Designer");
  await page
    .getByLabel("Email", { exact: false })
    .first()
    .fill("test@example.com");
  await page
    .getByLabel("Message")
    .fill("Please provide options for our lighting project.");
  await page.getByRole("button", { name: "Prepare email draft" }).click();
  await expect(
    page.getByRole("link", { name: "Open email app" }),
  ).toHaveAttribute("href", /mailto:suhail@bharatlums\.in\?.*Test%20Designer/);
  const invalid = await request.post("/api/enquiry", {
    data: { email: "invalid" },
  });
  expect(invalid.status()).toBe(400);
  const unavailable = await request.post("/api/enquiry", {
    data: {
      requestId: "e9aef718-96a6-4461-a799-06809783a346",
      name: "Test Designer",
      email: "test@example.com",
      company: "",
      phone: "",
      interest: "",
      projectType: "",
      location: "",
      quantity: "",
      message: "Test enquiry for lighting.",
    },
  });
  expect(unavailable.status()).toBe(503);
});

test("homepage fits small phone through ultra-wide layouts", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
});
