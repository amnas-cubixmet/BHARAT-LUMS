import "server-only";
import { createHash } from "node:crypto";
import { enquiryText, type Enquiry } from "./enquiry";

export function deliveryEnabled() {
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.ENQUIRY_FROM &&
    process.env.ENQUIRY_TO &&
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export async function allowEnquiry(address: string) {
  const key = `bharat-lums:enquiry:${createHash("sha256").update(address).digest("hex").slice(0, 32)}`;
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return n;",
      1,
      key,
      600,
    ]),
    signal: AbortSignal.timeout(4500),
  });
  if (!response.ok) throw new Error("Rate limit service unavailable");
  const data: { result?: number } = await response.json();
  if (typeof data.result !== "number")
    throw new Error("Rate limit service returned an invalid response");
  return data.result <= 6;
}

export async function deliverEnquiry(input: Enquiry, requestId: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `bharat-lums/${requestId}`,
    },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM,
      to: [process.env.ENQUIRY_TO],
      reply_to: input.email,
      subject: "New Bharat Lums website enquiry",
      text: enquiryText(input),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return false;
  const data: { id?: string } = await response.json();
  return Boolean(data.id);
}
