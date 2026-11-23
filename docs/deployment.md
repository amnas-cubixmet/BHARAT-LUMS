# Deploy Bharat Lums

## Vercel

1. Import the `amnas-cubixmet/BHARAT-LUMS` Git repository into a Bharat Lums Vercel project. Use the Next.js framework preset, repository root and Node.js 22 or newer.
2. Deploy and test the Vercel preview URL. Leave `SITE_URL` blank in preview environments so search engines are asked to avoid indexing previews.
3. Configure the email service and rate limiter in the intended environment. Redeploy after changing environment variables. The form uses the verified business-card email address for its email-draft option.
4. In the project’s Domains settings, add `www.bharatlums.com` after the owner confirms it. Add the DNS records shown by Vercel at the registrar. Configure the apex redirect if the owner controls that domain. The `.in` address printed on the business card can be linked or redirected if its owner approves.
5. After Vercel confirms the DNS records and TLS certificate, set `SITE_URL=https://www.bharatlums.com` in production and redeploy. This enables the canonical metadata, sitemap and production indexing.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Confirmed HTTPS origin with no path |
| `RESEND_API_KEY` | Server-only Resend API key |
| `ENQUIRY_FROM` | Sender address using a domain verified in Resend |
| `ENQUIRY_TO` | Monitored inbox for website enquiries |
| `UPSTASH_REDIS_REST_URL` | Shared Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only Upstash Redis REST token |

The Node.js route requires a server deployment. For self-hosting, the reverse proxy should set and overwrite the `X-Real-IP` header and remove inbound `X-Vercel-Forwarded-For` headers. Vercel supplies the trusted forwarding header on its platform.

## Production verification

- Open the custom HTTPS domain and verify its redirect behavior and certificate.
- Check the canonical URL, social preview, `/robots.txt` and `/sitemap.xml`.
- Browse a collection, fixture and project on a desktop and a phone. Test the Studio with WebGL and its 2D preview.
- Submit a test quote and confirm it reaches the configured inbox with the correct reply-to address. Also confirm the email-draft option works in an environment with the credentials unset.
- Confirm all product specifications, project records, imagery and contact details are approved for publication.

Official references at [Vercel Domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [Vercel Environment Variables](https://vercel.com/docs/environment-variables), [Resend](https://resend.com/docs/api-reference/emails/send-email) and [Upstash Redis REST](https://upstash.com/docs/redis/features/restapi).
