# Verification

The checks below ran against the production build on 23 November 2026.

| Check | Result |
| --- | --- |
| Production Next.js build | Passed |
| ESLint | Passed |
| TypeScript | Passed |
| Playwright desktop Chromium and emulated Pixel 7 | 10 passed, including two data validation tests |
| Homepage layout at 320, 430, 768, 1024, 1440 and 1920 px | No horizontal overflow in the tested layouts |
| Homepage accessibility | No violations in the axe WCAG 2 A/AA and 2.1 AA checks run with reduced motion |
| Catalogue and portfolio | Navigation, featured project carousel, collection routes, search, filtering, quick preview, gallery, project detail and missing-product response passed |
| Light Studio | WebGL rendered. Fixture power and camera controls changed the rendered output. Mobile touch orbit, the 2D fallback and handoff to the quote form passed |
| Enquiry form | Client validation, server validation, email draft and the unavailable-service response passed |
| Configured email route with simulated providers | Six accepted requests followed by a rate-limited seventh request. Verified the recipient, reply-to address, message and idempotency header sent to the simulated provider |
| Live delivery and custom domain | Pending production service credentials, hosting and DNS verification |

Desktop and mobile screenshots of the homepage and Light Studio are supplied in the project archive. The mobile test used Chromium device emulation. Physical-device, Safari and Firefox testing were outside this run.
