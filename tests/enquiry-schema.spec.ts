import { expect, test } from "@playwright/test";
import { enquirySchema, enquiryText, studioSchema } from "../src/lib/enquiry";
import { defaultSetup, setupQuery, summarizeSetup } from "../src/lib/studio";

test("the enquiry schema trims field inputs and rejects invalid quantity and phone formats", () => {
  const value = {
    name: "  Jane Designer  ",
    email: "jane@example.com",
    company: "",
    phone: "+91 98765 43210",
    interest: "Linear",
    projectType: "",
    location: "",
    quantity: "17",
    message: "New suspended lighting project.",
  };
  const result = enquirySchema.parse(value);
  expect(result.name).toBe("Jane Designer");
  expect(enquiryText(result)).toContain("Quantity: 17");
  expect(enquirySchema.safeParse({ ...value, quantity: "2.7" }).success).toBe(
    false,
  );
  expect(enquirySchema.safeParse({ ...value, phone: "++76" }).success).toBe(
    false,
  );
});

test("studio links round-trip and reject malformed or unsupported selections", () => {
  const values = Object.fromEntries(
    new URLSearchParams(setupQuery(defaultSetup)),
  );
  expect(studioSchema.parse(values)).toEqual(defaultSetup);
  expect(summarizeSetup(defaultSetup)).toContain("2700 K");
  expect(
    studioSchema.safeParse({ ...values, brightness: "101", power: "yes" })
      .success,
  ).toBe(false);
});
