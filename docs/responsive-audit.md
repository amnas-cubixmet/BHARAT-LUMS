# Responsive and Safari audit — November 24, 2026

## Scope
Routes: home, about, products, dynamic product detail, portfolio, contact,
and quotation. Chromium checks cover 320, 375, 390, 430, 768, 1024, 1280,
1440, and 1920 pixel widths, plus breakpoint boundaries and landscape sizes.
WebKit mobile emulation covers 320/375/390/430 widths with reduced motion
enabled and disabled.

## Implemented
- Replaced the deprecated Three.Clock readings in the streetlight and globe
  with frame-delta accumulation; long resume gaps are clamped.
- Prevented a full homepage reload when following Global Presence navigation,
  while respecting the visitor's reduced-motion preference.
- Preserved catalogue slider position across responsive resize and rotation.
  Existing touch/scroll handling remains intact.
- Enabled WebKit browser emulation tests for route overflow, menu navigation,
  category stepping, country switching, and reduced-motion styles.
- Extended Chromium responsive coverage to 1280px and 1440px.

## Run all checks
Using Node.js 22 or newer:

```sh
npm ci
npm run lint
npm run typecheck
npm run build
npx playwright install --with-deps chromium webkit
npm test
```

The repository's existing Chromium tests also exercise product images, modal
gallery, enquiry drafts, Three.js scenes and touch interactions.

**Limitations:** Playwright WebKit emulation is not physical iPhone testing.
Real Safari GPU behavior, thermal throttling and iOS rubber-band scrolling
still need device verification. A pre-change screenshot baseline is unavailable,
so the WebKit test captures **after** screenshots only. Consult the pull
request CI run for execution results rather than assuming a passing build.
