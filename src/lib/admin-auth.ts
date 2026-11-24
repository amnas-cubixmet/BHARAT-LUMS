import { createHash, timingSafeEqual } from "node:crypto";

export function authorized(header: string | null) {
  const password = process.env.EMAIL_ADMIN_PASSWORD;
  if (!password || password.length < 24 || !header?.startsWith("Basic ")) return false;
  const actual = Buffer.from(header.slice(6), "base64").toString("utf8");
  const expected = `${process.env.EMAIL_ADMIN_USER || "admin"}:${password}`;
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(actual), hash(expected));
}
export function unauthorized() {
  return new Response("Authentication required", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Bharat Lums email settings", charset="UTF-8"', "Cache-Control": "no-store" } });
}
