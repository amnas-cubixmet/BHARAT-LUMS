import { z } from "zod";
import { arrangements, environments, finishes, mountings } from "./studio";

const optionalText = (max: number) => z.string().trim().max(max);

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  company: optionalText(120),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email.")
    .max(160)
    .email("Enter a valid email address."),
  phone: optionalText(30).refine(
    (value) => !value || /^(?=(?:\D*\d){7,15}\D*$)[+\d() -]+$/.test(value),
    "Enter a valid phone number.",
  ),
  interest: optionalText(150),
  projectType: optionalText(80),
  location: optionalText(160),
  quantity: optionalText(8).refine(
    (value) => !value || /^[1-9]\d{0,6}$/.test(value),
    "Enter a positive whole number.",
  ),
  message: z
    .string()
    .trim()
    .min(12, "Add at least 12 characters about your project.")
    .max(2200),
  website: z.string().max(100).optional(),
});

export const studioSchema = z.object({
  brightness: z
    .string()
    .regex(/^(0|[1-9]\d?|100)$/)
    .transform(Number),
  temperature: z
    .enum(["2700", "4000", "6500"])
    .transform(
      (value) =>
        ({ "2700": 2700, "4000": 4000, "6500": 6500 })[value] as
          2700 | 4000 | 6500,
    ),
  power: z.enum(["on", "off"]).transform((value) => value === "on"),
  arrangement: z.enum(arrangements),
  finish: z.enum(finishes),
  mounting: z.enum(mountings),
  environment: z.enum(environments),
});

export type Enquiry = z.infer<typeof enquirySchema>;

export function enquiryText(input: Enquiry) {
  return (
    [
      ["Name", input.name],
      ["Company", input.company],
      ["Email", input.email],
      ["Phone", input.phone],
      ["Product interest", input.interest],
      ["Project type", input.projectType],
      ["Location", input.location],
      ["Quantity", input.quantity],
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`)
      .join("\n") + `\n\n${input.message}`
  );
}
