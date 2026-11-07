# QA report, round 5 (latest, orchestrator review round 2 of 3)

Verdict: **FAIL**. The code is unchanged. `src/fixtures/` still does not exist, so the same 2 blockers remain.

## Re-checked
- `npm test` passes. `npm run build:preview` builds 15 pages. `node scripts/check-dist.mjs dist /preview` is OK.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `dist/qr/` holds only `index.html`, so `/qr/1417304/` is not prerendered.
- QA's network access to EPREL is still denied (the `curl` was refused). I did not hand-write a record, because that would be invented data.

## Blockers
- (high) No real EPREL fixture `src/fixtures/eprel-1417304.json`. SPEC §6.4, §6.6, §6.7 and §6.11 are unmet.
- (high) The lookup, proxy and letter have never run against a real EPREL response.

Human step: run `node scripts/refresh-fixtures.mjs 1417304` on a networked machine. Then the Builder wires up the fixture, the proxy test, the prerendered `/qr/1417304/` and the real group-page examples.

Older rounds follow below.

---

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

# QA report, round 2

Verdict: **FAIL**. Nothing has changed since round 1. The same 2 blockers remain.

## Re-checked
- `npm test`: 18 files, 78 tests pass.
- `npm run build:preview`: OK, 15 pages. `node scripts/check-dist.mjs dist /preview`: OK.
- `src/fixtures/` still does not exist, and `dist/qr/` holds only `index.html`. So `/qr/1417304/` is not prerendered.
- `public/_redirects` and `CLAUDE.md` still describe a prerendered `/qr/1417304/` that does not exist.
- The sitemap still lists URLs without a trailing slash (e.g. `/preview/geschirrspueler`) while the canonicals have one.
- QA has no network access either (the Bash `curl` to EPREL was denied), so the fixture could not be fetched here. A hand-written fixture would be invented data, so none was created.
- Not re-run this round: `npm audit` (it was in the denied batch; round 1 found 0 vulnerabilities and dependencies have not changed).

## Blockers (unchanged)
1. No real EPREL fixture, so SPEC §6.4, §6.6, §6.7 and §6.11 are unmet.
2. The lookup, proxy and letter have never run against a real EPREL response.

Both need one human step: run `node scripts/refresh-fixtures.mjs 1417304`, or `curl https://eprel.ec.europa.eu/api/product/1417304`, from a networked machine. Then the Builder can wire up the fixture, the proxy test, the prerendered `/qr/1417304/` and the real group-page examples.

## Round 2: blockers

- (high) Real EPREL fixture src/fixtures/eprel-1417304.json is missing. SPEC §6.4 (proxy test against the real record), §6.6 (rendered Bosch/WAJ240L2SN/27.12.2034/München result) and §6.7 (/qr/1417304 prerendered, noindex) are unmet. dist/qr contains only the client shell. Group-page examples are computed Rechenbeispiele, not real EPREL records (§6.11). CLAUDE.md and public/_redirects describe a prerendered /qr/1417304/ that does not exist. [src/fixtures/, src/pages/qr/, src/data/groups.ts, public/_redirects, CLAUDE.md]
- (high) The lookup, proxy and letter have never run against a real EPREL response. The contactDetails and date field shapes in pickEprelFields and the EPREL group-name mapping for tumble dryers, smartphones and displays are unverified. A shape mismatch would break every live lookup or leave the letter without a manufacturer address. [src/lib/eprel.ts, src/lib/eprel-proxy.ts, src/lib/rules.ts]

# QA report, round 3

Verdict: **FAIL**. Nothing has changed since round 2. The same 2 blockers remain, and both need a human step.

## Re-checked
- `npm test`: 18 files, 78 tests pass.
- `npm run build:preview`: OK, 15 pages. `node scripts/check-dist.mjs dist /preview`: OK.
- `npm audit --omit=dev`: 0 vulnerabilities.
- `src/fixtures/` still does not exist. `dist/qr/` holds only `index.html`, so `/qr/1417304/` is not prerendered.
- `public/_redirects` and `CLAUDE.md` still describe a prerendered `/qr/1417304/` that does not exist.
- The sitemap still lists URLs without a trailing slash while the canonicals have one (warning only).
- QA's `curl` to EPREL was denied again, so the fixture could not be fetched. A hand-written fixture would be invented data, so none was created.

## Round 3: blockers

- (high) Real EPREL fixture src/fixtures/eprel-1417304.json is missing. SPEC §6.4, §6.6 and §6.7 are unmet. /qr/1417304 is not prerendered. Group pages use computed Rechenbeispiele (§6.11). CLAUDE.md and public/_redirects describe a prerendered page that does not exist. [src/fixtures/, src/pages/qr/, src/data/groups.ts, public/_redirects, CLAUDE.md]
- (high) The core lookup, proxy and letter are unverified against a real EPREL response. A shape mismatch would break every live lookup or leave the letter without a manufacturer address. [src/lib/eprel.ts, src/lib/eprel-proxy.ts, src/lib/rules.ts]

## Round 3: blockers

- (high) Real EPREL fixture src/fixtures/eprel-1417304.json is missing. The proxy test uses a synthetic record, there is no rendered Bosch/WAJ240L2SN/27.12.2034/München result, /qr/1417304 is not prerendered (dist/qr has only the client shell), and group-page examples are computed Rechenbeispiele, not real EPREL records. CLAUDE.md and public/_redirects describe a prerendered page that does not exist. [src/fixtures/, src/pages/qr/, src/data/groups.ts, public/_redirects, CLAUDE.md]
- (high) The core lookup, proxy and letter have never run against a real EPREL response. The contactDetails and date field shapes and the EPREL group names for tumble dryers, smartphones and displays are unverified. A mismatch would break every live lookup or leave the letter without a manufacturer address. [src/lib/eprel.ts, src/lib/eprel-proxy.ts, src/lib/rules.ts]

# QA report, round 4 (after the operator resumed the run on 2026-11-07)

Verdict: **FAIL**. The code is unchanged. `src/fixtures/` still does not exist, so the same 2 blockers remain.

## Re-checked
- `npm test`: 18 files, 78 tests pass.
- `npm run build:preview`: OK, 15 pages. `node scripts/check-dist.mjs dist /preview`: OK.
- `npm audit --omit=dev`: 0 vulnerabilities.
- No `document.cookie` or `localStorage` in `dist`. No secret patterns in `src`, `functions`, `scripts` or `public`.
- `dist/qr/` holds only `index.html`. `/qr/1417304/` is not prerendered.
- `CLAUDE.md` and `public/_redirects` still describe a prerendered `/qr/1417304/`.
- Sitemap entries have no trailing slash, but canonicals do (warning).
- The QA sandbox still denies network access (the `curl` to EPREL was denied), so I could not fetch the record. I did not hand-write one, because that would be invented data.

## Blockers
- (high) No real EPREL fixture `src/fixtures/eprel-1417304.json`. SPEC §6.4, §6.6, §6.7 and §6.11 are unmet.
- (high) The lookup, proxy and letter have never run against a real EPREL response (field shapes and group names unverified).

Both need one human step: run `node scripts/refresh-fixtures.mjs 1417304` on a networked machine, then let the Builder wire up the fixture.

## Round 1: blockers

- (high) Real EPREL fixture src/fixtures/eprel-1417304.json is missing. SPEC 6.4 (proxy test on the real record), 6.6 (rendered Bosch/WAJ240L2SN/27.12.2034/München result), 6.7 (prerendered /qr/1417304 with noindex) and 6.11 (real EPREL example on group pages) are unmet. dist/qr holds only the client shell. CLAUDE.md and public/_redirects describe a prerendered page that does not exist. [src/fixtures/, src/pages/qr/, src/data/groups.ts, public/_redirects, CLAUDE.md]
- (high) The core lookup, proxy and letter have never run against a real EPREL response. The contactDetails and date field shapes and the EPREL group names for tumble dryers, smartphones and displays are unverified. A mismatch would break every live lookup or leave the letter without a manufacturer address. [src/lib/eprel.ts, src/lib/eprel-proxy.ts, src/lib/rules.ts]

## Round 2: blockers

- (high) Real EPREL fixture src/fixtures/eprel-1417304.json is missing. SPEC 6.4 (proxy test on the real record), 6.6 (rendered Bosch/WAJ240L2SN/27.12.2034/München result), 6.7 (prerendered /qr/1417304 with noindex) and 6.11 (real EPREL example on group pages) are unmet. dist/qr holds only the client shell. CLAUDE.md and public/_redirects describe a prerendered page that does not exist. [src/fixtures/, src/pages/qr/, src/data/groups.ts, public/_redirects, CLAUDE.md]
- (high) The core lookup, proxy and letter have never run against a real EPREL response. The contactDetails and date field shapes in pickEprelFields and the EPREL group names for tumble dryers, smartphones and displays are unverified. A mismatch would break every live lookup or leave the letter without a manufacturer address. [src/lib/eprel.ts, src/lib/eprel-proxy.ts, src/lib/rules.ts]
