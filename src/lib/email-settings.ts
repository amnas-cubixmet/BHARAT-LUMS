import "server-only";
import { createCipheriv, createDecipheriv, randomBytes, createHash } from "node:crypto";
import { z } from "zod";

const keyName = "bharat-lums:email-settings:v1";
const aad = Buffer.from(keyName);
const singleLine = (max: number) => z.string().trim().min(1).max(max).refine(v => !/[\r\n\x00]/.test(v));
const email = z.string().trim().max(160).email();
const appPassword = z.string().transform(v => v.replace(/\s/g, "")).pipe(z.string().regex(/^[a-zA-Z0-9]{16}$/));
export const settingsSchema = z.object({
  senderName: singleLine(100),
  senderEmail: email,
  recipientEmail: email,
  host: z.literal("smtp.gmail.com"),
  port: z.union([z.literal(465), z.literal(587)]),
  enabled: z.boolean(),
  appPassword: appPassword.or(z.literal("")),
}).strict();
export type EmailSettings = z.infer<typeof settingsSchema>;

export function storageConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function redis(command: (string | number)[]): Promise<unknown> {
  if (!storageConfigured()) throw new Error("Storage unavailable");
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    cache: "no-store",
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Storage unavailable");
  const data = await response.json();
  if (data.error || !("result" in data)) throw new Error("Storage failed");
  return data.result;
}

function encryptionKey() {
  const raw = process.env.EMAIL_SETTINGS_ENCRYPTION_KEY ?? "";
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("Missing or invalid encryption key");
  return key;
}
function encrypt(settings: EmailSettings) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(aad);
  const data = Buffer.concat([cipher.update(JSON.stringify(settings), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map(v => v.toString("base64")).join(".");
}
function decrypt(record: string) {
  const [iv, tag, data] = record.split(".").map(v => Buffer.from(v, "base64"));
  const cipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(aad);
  cipher.setAuthTag(tag);
  return settingsSchema.parse(JSON.parse(Buffer.concat([cipher.update(data), cipher.final()]).toString("utf8")));
}
function defaults(): EmailSettings {
  const port = Number(process.env.SMTP_PORT || "465");
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  if (host !== "smtp.gmail.com" || (port !== 465 && port !== 587)) throw new Error("Unsupported SMTP configuration");
  if (process.env.SMTP_SECURE && process.env.SMTP_SECURE !== String(port === 465)) throw new Error("Invalid SMTP TLS configuration");
  const senderEmail = process.env.SMTP_USER ?? "";
  const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL ?? "";
  const password = (process.env.SMTP_APP_PASSWORD ?? "").replace(/\s/g, "");
  return {
    senderName: process.env.SMTP_FROM_NAME || "BHARAT LUMS",
    senderEmail, recipientEmail, host, port,
    appPassword: password,
    enabled: Boolean(senderEmail && recipientEmail && password),
  };
}
export async function getSettings(): Promise<EmailSettings> {
  const record = await redis(["GET", keyName]);
  if (record === null) return defaults();
  if (typeof record !== "string") throw new Error("Invalid settings record");
  return decrypt(record);
}
export function publicSettings(settings: EmailSettings) {
  const { appPassword, ...safe } = settings;
  return { ...safe, hasPassword: Boolean(appPassword), configured: Boolean(settings.enabled && settings.senderEmail && settings.recipientEmail && appPassword) };
}
export async function saveSettings(input: EmailSettings) {
  const previous = await getSettings();
  if (input.senderEmail !== previous.senderEmail && !input.appPassword) throw new Error("A new app password is required when changing the sender.");
  const settings = settingsSchema.parse({ ...input, appPassword: input.appPassword || previous.appPassword });
  if (settings.enabled && !settings.appPassword) throw new Error("Enter a Gmail app password.");
  if (await redis(["SET", keyName, encrypt(settings)]) !== "OK") throw new Error("Settings could not be saved");
  return publicSettings(settings);
}

export async function rateLimit(scope: string, identifier: string, limit: number, seconds = 600) {
  const key = `bharat-lums:limit:${scope}:${createHash("sha256").update(identifier).digest("hex")}`;
  const count = await redis(["EVAL", "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return n", 1, key, seconds]);
  if (typeof count !== "number") throw new Error("Rate limiter unavailable");
  return count <= limit;
}
