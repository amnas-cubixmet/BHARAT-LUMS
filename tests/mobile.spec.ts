import { expect, test } from "@playwright/test";

test("mobile menu, touch orbit, product views and quote form fit the viewport", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.tap();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Light Studio" })
    .tap();
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  const canvas = page.locator(".studio-canvas canvas");
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  await canvas.scrollIntoViewIfNeeded();
  const bounds = (await canvas.boundingBox())!;
  const before = await canvas.screenshot({ animations: "disabled" });
  const cdp = await context.newCDPSession(page);
  const y = Math.round(bounds.y + bounds.height * 0.45);
  const x = Math.round(bounds.x + bounds.width * 0.38);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: x + 75, y: y + 9 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(async () =>
      (await canvas.screenshot({ animations: "disabled" })).equals(before),
    )
    .toBe(false);
  await page.getByRole("link", { name: "Request this configuration" }).tap();
  await expect(page.getByLabel("Message")).toHaveValue(
    /Light Studio configuration/,
  );
  await page.getByLabel("Full name").fill("Mobile Designer");
  await expect(
    page.getByRole("button", { name: "Prepare email draft" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.getByRole("button", { name: "Open menu" }).tap();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Products" })
    .tap();
  await expect(page.locator(".media-card")).toHaveCount(5);
  expect(errors).toEqual([]);
});
