import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { countries } from "../src/lib/global-presence";

test("country buttons and all eight 3D markers focus the globe", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const presence = page.getByRole("region", {
    name: "Lighting Beyond Borders",
  });
  const globe = presence.getByTestId("presence-canvas");
  const selectors = presence.getByRole("group", {
    name: "Countries on the map",
  });
  await expect(globe).toHaveCount(0);
  await presence.getByRole("heading", { level: 2 }).scrollIntoViewIfNeeded();
  await selectors.scrollIntoViewIfNeeded();
  await expect(
    presence.getByText("Interactive globe", { exact: true }),
  ).toBeVisible({ timeout: 20_000 });
  await expect(globe.locator("canvas")).toBeVisible();
  const detail = presence.locator("#presence-country-details");

  for (const location of countries) {
    const button = selectors.getByRole("button", {
      name: location.name,
      exact: true,
    });
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(
      detail.getByRole("heading", { name: location.name }),
    ).toBeVisible();
    await expect(globe.getByText(location.name, { exact: true })).toBeVisible();
  }

  const canvas = globe.locator("canvas");
  await canvas.scrollIntoViewIfNeeded();
  const bounds = (await canvas.boundingBox())!;
  const route = [7, 4, 3, 0, 1, 2, 5, 6, 7];
  function position(index: number, radius: number) {
    const location = countries[index];
    const lat = MathUtils.degToRad(location.latitude);
    const lon = MathUtils.degToRad(location.longitude);
    return new Vector3(
      Math.cos(lat) * Math.cos(lon),
      Math.sin(lat),
      -Math.cos(lat) * Math.sin(lon),
    ).multiplyScalar(radius);
  }
  const camera = new PerspectiveCamera(51, bounds.width / bounds.height);
  for (let index = 1; index < route.length; index++) {
    camera.position.copy(position(route[index - 1], 2.93));
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const point = position(route[index], 1.019).project(camera);
    const name = countries[route[index]].name;
    const x = bounds.x + ((point.x + 1) * bounds.width) / 2;
    const y = bounds.y + ((1 - point.y) * bounds.height) / 2;
    await page.mouse.click(x, y);
    await expect(detail.getByRole("heading", { name })).toBeVisible();
    await expect(globe.getByText(name, { exact: true })).toBeVisible();
  }

  await expect(
    presence.getByRole("link", { name: "Explore Our Products" }),
  ).toHaveAttribute("href", "/products");
  await expect(
    presence.getByRole("link", { name: "Contact Our Team" }),
  ).toHaveAttribute("href", "/contact");
  await presence.getByRole("button", { name: "Return to India" }).click();
  await expect(detail.getByRole("heading", { name: "India" })).toBeVisible();
  expect(errors).toEqual([]);
});

test("global presence has a keyboard-accessible fallback at phone width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    const native = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        kind: string,
        settings?: CanvasRenderingContext2DSettings,
      ) {
        return kind === "webgl" || kind === "webgl2"
          ? null
          : native.call(this, kind as "2d", settings);
      },
    });
  });
  await page.goto("/#global-presence");
  const presence = page.getByRole("region", {
    name: "Lighting Beyond Borders",
  });
  const selectors = presence.getByRole("group", {
    name: "Countries on the map",
  });
  const first = selectors.getByRole("button", { name: "India", exact: true });
  await first.focus();
  for (const location of countries.slice(1)) {
    await page.keyboard.press("Tab");
    await expect(
      selectors.getByRole("button", { name: location.name, exact: true }),
    ).toBeFocused();
  }

  await page.keyboard.press("Enter");
  await expect(
    presence.getByRole("img", { name: "Regional map with Oman highlighted" }),
  ).toBeVisible();
  await expect(presence.getByRole("heading", { name: "Oman" })).toBeVisible();
  await expect(presence.getByTestId("presence-canvas")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
  const accessibility = await new AxeBuilder({ page })
    .include("#global-presence")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("touch can rotate the globe on an emulated phone", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("/#global-presence");
    await page.locator("[data-presence-stage]").scrollIntoViewIfNeeded();
    await expect(
      page.getByText("Interactive globe", { exact: true }),
    ).toBeVisible({ timeout: 20_000 });
    const canvas = page.getByTestId("presence-canvas").locator("canvas");
    await canvas.scrollIntoViewIfNeeded();
    const bounds = (await canvas.boundingBox())!;
    const session = await context.newCDPSession(page);
    const x = Math.round(bounds.x + bounds.width * 0.45);
    const y = Math.round(bounds.y + bounds.height * 0.5);
    const before = await canvas.screenshot();
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x + 95, y: y + 8 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect
      .poll(async () => (await canvas.screenshot()).equals(before))
      .toBe(false);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(390);
  } finally {
    await context.close();
  }
});

test("scroll reveals the animated globe and selecting Oman changes the view", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  const presence = page.getByRole("region", {
    name: "Lighting Beyond Borders",
  });
  await expect(presence.getByTestId("presence-canvas")).toHaveCount(0);
  await presence.getByRole("heading", { level: 2 }).scrollIntoViewIfNeeded();
  const oman = presence.getByRole("button", { name: "Oman", exact: true });
  await oman.scrollIntoViewIfNeeded();
  await expect(
    presence.getByText("Interactive globe", { exact: true }),
  ).toBeVisible({ timeout: 20_000 });
  await expect(presence.locator("[data-presence-stage]")).toHaveCSS(
    "opacity",
    "1",
    { timeout: 15_000 },
  );
  await oman.click();
  await expect(presence.getByRole("heading", { name: "Oman" })).toBeVisible();
  await expect(
    presence.getByTestId("presence-canvas").getByText("Oman", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
