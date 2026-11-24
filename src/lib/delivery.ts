import "server-only";
import nodemailer from "nodemailer";
import { enquiryText, type Enquiry } from "./enquiry";
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
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
}
export async function deliverEnquiry(input: Enquiry, requestId: string) {
  const settings = await getSettings();
  const mailer = transport(settings);
  const key = `bharat-lums:enquiry-request:${requestId}`;
  const claimed = await redis(["SET", key, "pending", "NX", "EX", 600]);
  if (claimed !== "OK") return (await redis(["GET", key])) === "sent";
  const text = enquiryText(input);
  const subject = (input.subject || "Website enquiry").replace(/[\r\n\x00]+/g, " ");
  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#162136"><h1 style="background:#10223e;color:#fff;padding:24px">BHARAT LUMS</h1><h2>New website enquiry</h2><p style="white-space:pre-wrap;line-height:1.6;overflow-wrap:anywhere">${escapeHtml(text)}</p><p>Reply directly to this email to contact the customer.</p></div>`;
  try {
    const result = await mailer.sendMail({
      from: { name: settings.senderName, address: settings.senderEmail },
      to: settings.recipientEmail,
      replyTo: input.email,
      subject: `Bharat Lums: ${subject}`,
      text, html,
    });
    if (!result.accepted.length || result.rejected.length) return false;
    // A storage failure after SMTP acceptance must not report an email failure.
    try { await redis(["SET", key, "sent", "EX", 86400]); } catch { /* pending key expires */ }
    return true;
  } finally {
    mailer.close();
  }
}

export async function sendTestEmail() {
  const settings = await getSettings();
  const mailer = transport(settings);
  try {
    await mailer.verify();
    const result = await mailer.sendMail({
      from: { name: settings.senderName, address: settings.senderEmail },
      to: settings.recipientEmail,
      subject: "BHARAT LUMS — SMTP test",
      text: "Gmail SMTP accepted this test message from the Bharat Lums website.",
    });
    if (!result.accepted.length || result.rejected.length) throw new Error("Test email rejected");
  } finally {
    mailer.close();
  }
}
