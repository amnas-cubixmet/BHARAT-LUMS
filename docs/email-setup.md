# Gmail email setup

The homepage sends enquiries through the existing /api/enquiry endpoint. The contact and quote pages retain their draft fallback. SMTP acceptance means Gmail accepted the message, not guaranteed inbox delivery.

1. Create a persistent Upstash Redis database (Vercel Marketplace or Upstash). Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel server-only Production variables. Use separate databases for Preview and Production; do not flush or expire the settings key. The database stores the settings as AES-256-GCM ciphertext and rate-limit counters.
2. Generate a 32-byte base64 encryption key with `openssl rand -base64 32` and set EMAIL_SETTINGS_ENCRYPTION_KEY. Keep this key stable across deployments and back it up securely. Rotating or losing it without migration makes the stored settings unreadable.
3. Generate an admin password with `openssl rand -hex 32` and set EMAIL_ADMIN_PASSWORD (minimum 24 characters). EMAIL_ADMIN_USER defaults to admin. Use HTTPS; the browser prompts for HTTP Basic authentication. All admin routes and APIs reject missing or invalid authentication. The browser may cache credentials until closed; use a private window on shared machines. Rotate the password if exposed.
4. Enable Google 2-Step Verification for the sending account. Visit https://myaccount.google.com/apppasswords and create an app password. Google may not offer app passwords for some accounts or organization policies.
5. Copy the remaining SMTP defaults from .env.example into Vercel. SMTP_USER, SMTP_APP_PASSWORD and CONTACT_RECEIVER_EMAIL are optional bootstrap settings; otherwise configure them in the admin UI. Never use NEXT_PUBLIC_ for credentials.
6. Redeploy after adding environment variables. Open /admin/email-settings, authenticate, enter the Gmail address, 16-character app password, recipient, enable the service and save. The host is intentionally restricted to smtp.gmail.com to prevent credential disclosure and server-side request forgery. Port 465 uses implicit TLS; 587 requires STARTTLS.
7. Press Send Test Email after saving. Check the recipient inbox, then submit a real test enquiry from the homepage. Confirm Reply-To. Disable the service and confirm the API reports failure instead of success, then re-enable. Reload and redeploy to confirm persistence.

If Upstash, encryption or SMTP is unavailable, the application fails closed. The homepage exposes email/WhatsApp draft fallback after a failed submission. The existing rate limiter permits six attempts per IP per ten minutes and sixty globally; the admin test limit is five per ten minutes. A honeypot rejects filled hidden fields. Repeated request IDs are suppressed for ten minutes while pending and for 24 hours after recorded acceptance; SMTP cannot guarantee exactly-once delivery.

Never paste real passwords into issues, chat, repository files or build logs.
