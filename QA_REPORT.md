# QA report, round 1

Verdict: **FAIL** (2 blockers, both come from the missing real EPREL fixture).

## What was run
- `npm test`: 18 files, 78 tests pass.
- `npm run build` and `npm run build:preview`: both succeed, 15 pages.
- `node scripts/check-dist.mjs dist /preview`: OK. It checks one h1, `lang="de"`, viewport, unique titles, noindex on `/qr/*`, and that every link starts with `/preview/`.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Preview build, read by hand: no hardcoded root links. Canonical, sitemap, robots and `_redirects` all use `/preview/`. Every page has a canonical and a meta description. Group pages show "Keine Rechtsberatung". No `document.cookie` or `localStorage` in `dist`. No third-party scripts. Sponsored links are absent while the affiliate env vars are unset.
- Bash was denied partway through the session. The remaining checks were done with the file tools, so JS bundle size and a Lighthouse-style pass were not measured.

## Blockers
1. **No real EPREL fixture** (`src/fixtures/eprel-1417304.json` does not exist). PLAN A1 and A8b are marked blocked. Because of that:
   - SPEC §6.4 is not met. The proxy test uses a synthetic record.
   - SPEC §6.6 is not met. There is no rendered result with Bosch, WAJ240L2SN, 27.12.2034 or München.
   - SPEC §6.7 is not met. `/qr/1417304` is not prerendered. `dist/qr/` holds only the client shell, so `dist/qr/1417304/index.html` is missing and the preview shows no real result. CLAUDE.md and `public/_redirects` still say it is prerendered.
   - SPEC §6.11 is only partly met. The group pages say "worked example with a real EPREL record", but they use computed "Rechenbeispiele" with an assumed date. The pages say so honestly, but the criterion is not met.
2. **The core lookup has never run against a real EPREL response.** `pickEprelFields` and the field shapes for `contactDetails` and the date arrays are unverified (PLAN builder notes). The EPREL group names for tumble dryers, smartphones and displays are also unconfirmed. If the real shape differs, the central feature fails silently on every lookup, and the letter would carry no manufacturer address. This is the core promise of the product, so it can't ship unverified.

   Both blockers need a network fetch that the builder sandbox denies. A human has to run `curl https://eprel.ec.europa.eu/api/product/1417304` (or `node scripts/refresh-fixtures.mjs 1417304`). The Builder then wires up the fixture, the proxy test, the prerendered `/qr/1417304/` and the real group-page examples.

## Warnings
- The sitemap lists URLs without a trailing slash (`/preview/waschmaschine`), but the canonical URLs have one (`/preview/waschmaschine/`). Align them.
- The `rules.ts` rows all have `verified: false`. The dishwasher and fridge periods use the shorter 7 years, which is the safe side.
- The letter cites "§§ 479a ff. BGB" because § 479b was not verified. That is acceptable under SPEC §6.10.
- The "Reparaturcafé" link goes to a Google search URL (an external link, no tracking added). Consider a neutral directory.
- On GitHub Pages, `404.html` only works for the unknown-path fallback if it is served from the site root. Check this on the actual preview host.
- JS gzip size is unmeasured (target below 50 KB).
- The Impressum and Datenschutz pages are drafts with placeholders, as required. A lawyer must review them.

## Round 1: blockers

- (high) Real EPREL fixture src/fixtures/eprel-1417304.json is missing. Criteria 4, 6 and 7 are unmet: the proxy test uses a synthetic record, there is no rendered Bosch/WAJ240L2SN/27.12.2034/München result, and /qr/1417304 is not prerendered (dist/qr has only the client shell). Group-page examples are computed Rechenbeispiele, not real EPREL records (criterion 11). CLAUDE.md and _redirects describe a prerendered page that does not exist. [src/fixtures/, src/pages/qr/, src/data/groups.ts, PLAN A1/A8b]
- (high) The lookup, proxy and letter have never run against a real EPREL response. The contactDetails and date field shapes in pickEprelFields and the EPREL group-name mapping for tumble dryers, smartphones and displays are unverified. A shape mismatch would make every live lookup fail or leave the letter without a manufacturer address. [src/lib/eprel.ts, src/lib/eprel-proxy.ts, src/lib/rules.ts]
