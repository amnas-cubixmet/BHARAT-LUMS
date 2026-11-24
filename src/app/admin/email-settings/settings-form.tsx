"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./settings.module.css";

type Settings = { senderName: string; senderEmail: string; recipientEmail: string; host: string; port: number; enabled: boolean; hasPassword: boolean; configured: boolean };
const endpoint = "/api/admin/email-settings";

export function EmailSettingsForm() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [appPassword, setAppPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState<"load" | "save" | "test" | null>("load");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [connection, setConnection] = useState("Not tested");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(endpoint, { cache: "no-store", signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not load settings.");
      setSettings(data);
    }).catch(error => { if (!controller.signal.aborted) setStatus({ ok: false, message: error instanceof Error ? error.message : "Could not load settings." }); })
      .finally(() => { if (!controller.signal.aborted) setBusy(null); });
    return () => controller.abort();
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings(current => current ? { ...current, [key]: value } : null);
    setDirty(true);
    setConnection("Not tested");
  }

  async function run(action: "save" | "test") {
    if (!settings || busy) return;
    setBusy(action);
    setStatus(null);
    try {
      const { hasPassword, configured, ...fields } = settings;
      // Exclude response-only flags from write payloads.
      void hasPassword; void configured;
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(action === "save" ? { action, settings: { ...fields, appPassword } } : { action }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Operation failed.");
      if (action === "save") {
        setSettings(data.settings); setAppPassword(""); setShow(false); setDirty(false); setConnection("Not tested");
      } else setConnection("SMTP verified; test accepted");
      setStatus({ ok: true, message: data.message });
    } catch (error) {
      if (action === "test") setConnection("Test failed");
      setStatus({ ok: false, message: error instanceof Error ? error.message : "Operation failed." });
    } finally { setBusy(null); }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void run("save"); }
  return (
    <div className={styles.panel}>
      {busy === "load" && <p role="status">Loading settings…</p>}
      {settings && <form onSubmit={submit} className={styles.form}>
        <fieldset disabled={Boolean(busy)} className={styles.grid}>
          <label>Sender Name<input required maxLength={100} value={settings.senderName} onChange={e => update("senderName", e.target.value)} /></label>
          <label>Sender Gmail Address<input required type="email" maxLength={160} value={settings.senderEmail} onChange={e => update("senderEmail", e.target.value)} /></label>
          <label className={styles.full}>Gmail App Password
            <span className={styles.password}><input type={show ? "text" : "password"} autoComplete="new-password" maxLength={32} placeholder={settings.hasPassword ? "Saved — leave blank to retain" : "Enter app password"} value={appPassword} onChange={e => { setAppPassword(e.target.value); setDirty(true); setConnection("Not tested"); }} /><button type="button" aria-pressed={show} onClick={() => setShow(v => !v)}>{show ? "Hide" : "Show"}</button></span>
            <small>Previously saved passwords are never returned.</small>
          </label>
          <label className={styles.full}>Recipient Email Address<input required type="email" maxLength={160} value={settings.recipientEmail} onChange={e => update("recipientEmail", e.target.value)} /></label>
          <label>SMTP Host<input readOnly value={settings.host} /></label>
          <label>SMTP Port<select value={settings.port} onChange={e => update("port", Number(e.target.value))}><option value={465}>465 — TLS</option><option value={587}>587 — STARTTLS</option></select></label>
          <label className={styles.toggle}><input type="checkbox" checked={settings.enabled} onChange={e => update("enabled", e.target.checked)} /> Enable Email Service</label>
        </fieldset>
        <p className={styles.connection}>Connection status: {!settings.enabled ? "Disabled" : !settings.configured ? "Not configured" : connection}{dirty ? " (unsaved changes)" : ""}</p>
        <div className={styles.actions}>
          <button className="button button-primary" type="submit" disabled={Boolean(busy)}>{busy === "save" ? "Saving…" : "Save Settings"}</button>
          <button className="button button-outline" type="button" disabled={Boolean(busy) || dirty || !settings.configured || !settings.enabled} onClick={() => void run("test")}>{busy === "test" ? "Testing…" : "Send Test Email"}</button>
        </div>
      </form>}
      {status && <p className={styles.status} role={status.ok ? "status" : "alert"}>{status.message}</p>}
    </div>
  );
}
