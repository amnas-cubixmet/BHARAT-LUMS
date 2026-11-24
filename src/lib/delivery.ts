import "server-only";
import nodemailer from "nodemailer";
import { type Enquiry, type EnquirySource } from "./enquiry";
import { buildEnquiryEmail, sampleEnquiry } from "./email-template";
import { defaultTemplates } from "./email-template-settings";
import { getSettings, rateLimit, redis, settingsSchema, storageConfigured, type EmailSettings } from "./email-settings";

export function deliveryEnabled() {
  return storageConfigured();
}

export async function allowEnquiry(address: string) {
  return await rateLimit("enquiry-ip", address, 6) && await rateLimit("enquiry-global", "all", 60);
}

function transport(settings: EmailSettings) {
  const s = settingsSchema.parse(settings);
  if (!s.enabled || !s.appPassword) throw new Error("Email service disabled or not configured");
  return nodemailer.createTransport({
    host: s.host,
    port: s.port,
    secure: s.port === 465,
    requireTLS: s.port === 587,
    auth: { user: s.senderEmail, pass: s.appPassword },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 15000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}
export async function deliverEnquiry(input: Enquiry, requestId: string, source: EnquirySource) {
  const settings = await getSettings();
  const mailer = transport(settings);
  const key = `bharat-lums:enquiry-request:${requestId}`;
  const claimed = await redis(["SET", key, "pending", "NX", "EX", 600]);
  if (claimed !== "OK") return (await redis(["GET", key])) === "sent";
  const email = buildEnquiryEmail(input, source, settings.templates ?? defaultTemplates, requestId);
  try {
    const result = await mailer.sendMail({
      from: { name: settings.senderName, address: settings.senderEmail },
      to: settings.recipientEmail,
      replyTo: input.email,
      ...email,
    });
    if (!result.accepted.length || result.rejected.length) return false;
    // A storage failure after SMTP acceptance must not report an email failure.
    try { await redis(["SET", key, "sent", "EX", 86400]); } catch { /* pending key expires */ }
    return true;
  } finally {
    mailer.close();
  }
}

export async function sendTestEmail(source: EnquirySource = "home") {
  const settings = await getSettings();
  const mailer = transport(settings);
  try {
    await mailer.verify();
    const result = await mailer.sendMail({
      from: { name: settings.senderName, address: settings.senderEmail },
      to: settings.recipientEmail,
      ...buildEnquiryEmail(sampleEnquiry, source, settings.templates ?? defaultTemplates, "TEST", true),
    });
    if (!result.accepted.length || result.rejected.length) throw new Error("Test email rejected");
  } finally {
    mailer.close();
  }
}
