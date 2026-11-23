# Bharat Lums

A responsive architectural lighting website and interactive Light Studio. Next.js App Router, TypeScript and Tailwind CSS handle the application. GSAP drives the homepage entrance and scroll reveals. Three.js, React Three Fiber and Drei render the Studio. Motion handles portfolio filter transitions.

## Run locally

Use Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The catalogue, portfolio, Studio and email-draft fallback work without service credentials.

## Content and assets

- The Illustrator logo was exported as an original-colour SVG and transparent PNG. The website uses a lighter blue treatment of the same artwork. The business card supplied the contact name, phone and email.
- The proposed catalogue has 16 lighting families and five demonstration fixtures. Replace the fixtures and artwork in `src/lib/catalogue.ts` with verified product records and datasheets before listing them commercially.
- Portfolio artwork and hero imagery are AI-generated architectural concepts. Portfolio records are labeled **Concept / Inspiration**. Replace them with approved photography and verified project details when available.
- The Studio supports seven arrangements, four room environments, three fixture finishes, three mounting modes, brightness and three colour temperatures. The 2D preview keeps the controls usable when WebGL is unavailable. Both previews are illustrative.

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
