import { authorized, unauthorized } from "@/lib/admin-auth";
import { getSettings, publicSettings, rateLimit, saveSettings, settingsSchema } from "@/lib/email-settings";
import { sendTestEmail } from "@/lib/delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "private, no-store" } });

export async function GET(request: Request) {
  if (!authorized(request.headers.get("authorization"))) return unauthorized();
  try { return json(publicSettings(await getSettings())); }
  catch { return json({ message: "Settings storage unavailable. Check production configuration." }, 503); }
}

export async function POST(request: Request) {
  if (!authorized(request.headers.get("authorization"))) return unauthorized();
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") return json({ message: "Invalid request origin." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ message: "JSON required." }, 415);
  const reader = request.body?.getReader();
  if (!reader) return json({ message: "Missing body." }, 400);
  let payload: unknown;
  try {
    let size = 0;
    const decoder = new TextDecoder("utf-8", { fatal: true });
    let raw = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) { await reader.cancel(); return json({ message: "Request too large." }, 413); }
      raw += decoder.decode(value, { stream: true });
    }
    payload = JSON.parse(raw + decoder.decode());
  } catch { return json({ message: "Invalid JSON." }, 400); }
  finally { reader.releaseLock(); }
  if (!payload || typeof payload !== "object" || !("action" in payload)) return json({ message: "Invalid action." }, 400);
  try {
    if (payload.action === "test") {
      if (!await rateLimit("admin-test", "global", 5)) return json({ message: "Too many test emails. Try later." }, 429);
      await sendTestEmail();
      return json({ message: "SMTP connection verified and test email accepted. Check the recipient inbox." });
    }
    if (payload.action !== "save" || !("settings" in payload)) return json({ message: "Invalid action." }, 400);
    const parsed = settingsSchema.safeParse(payload.settings);
    if (!parsed.success) return json({ message: "Check email addresses, sender name, Gmail host, port and 16-character app password." }, 400);
    const previous = await getSettings();
    if ((!parsed.data.appPassword && parsed.data.senderEmail !== previous.senderEmail) || (parsed.data.enabled && !parsed.data.appPassword && !previous.appPassword))
      return json({ message: "Enter a new Gmail app password." }, 400);
    const settings = await saveSettings(parsed.data);
    return json({ settings, message: "Settings saved securely." });
  } catch {
    return json({ message: "Operation failed. Check Redis, encryption configuration, Gmail credentials and service status." }, 502);
  }
}
