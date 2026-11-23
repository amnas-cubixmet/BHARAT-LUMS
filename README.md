# Bharat Lums

A responsive LED lighting website and product catalogue. Next.js App Router, TypeScript and Tailwind CSS handle the application. GSAP drives the homepage entrance and scroll reveals. Three.js and React Three Fiber render the homepage streetlight and globe. Motion handles portfolio filter transitions.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The catalogue, portfolio and email-draft fallback work without service credentials.

## Content and assets

- The Illustrator logo was exported as an original-colour SVG and transparent PNG. The website uses a lighter blue treatment of the same artwork. The business card supplied the contact name, phone and email.
- The catalogue shows ten LED lighting categories. Source records and representative imagery are in `src/lib/catalogue.ts`. Add verified product records and datasheets before publishing individual models.
- Portfolio artwork and hero imagery are AI-generated architectural concepts. Portfolio records are labeled **Concept / Inspiration**. Replace them with approved photography and verified project details when available.

## Enquiries

Create `.env.local` from `.env.example` when credentials are available. Online submission uses Resend and a shared Upstash rate limiter. Without both services configured, the form prepares a draft for the visitor to open and send in their own mail app. An accepted provider request does not guarantee inbox delivery.

## Checks

```sh
npm run lint
npm run build
npm run typecheck
npx playwright install chromium
npm test
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an installed Chromium binary. Desktop and mobile tests run against the production server. The CI workflow installs Chromium and runs the same checks.

See [deployment](docs/deployment.md) and [test results](docs/verification.md).
