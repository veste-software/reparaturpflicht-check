# Reparaturpflicht-Check

Built by an automated studio. Read `SPEC.md` (what and why), `PLAN.md` (the task list) and this file (how) before changing anything.

## Rules for every contributor, human or agent

- Never commit secrets. Environment variable names go in `.env.example`, values never do.
- Payments stay in test mode until the owner goes live.
- Do not run `git commit` or `git push`. The studio orchestrator commits.
- `npm test` and `npm run build` must pass before work counts as done.
- Pages that answer a search query must be real tools or substantive answers, never thin filler.

## Stack, layout and commands

**Stack:** Astro 7 (static output, TypeScript strict) + Tailwind CSS 4 (`@tailwindcss/vite`) + Preact islands for the interactive tool. One Cloudflare Pages Function (`functions/api/eprel/[id].ts`) is the only server code: a keyless, whitelisting, 24 h-cached proxy to `https://eprel.ec.europa.eu/api/product/<n>`. No database, no accounts. Tests: Vitest. Type check: `astro check`.

### Commands (all exit on their own)

| Command | What it does |
|---|---|
| `npm test` | `vitest run`, unit tests in `src/**/*.test.ts` and `functions/**/*.test.ts` |
| `npm run build` | static build to `dist/` (base `/`, site falls back to `http://localhost:4321`) |
| `npm run build:preview` | same build with `SITE_URL=https://example.github.io SITE_BASE=/preview`; every link must start with `/preview/` |
| `npm run lint` | `astro check` (TypeScript + Astro diagnostics) |

Never run `npm run dev` / `astro dev` / `astro preview` / `vitest` without `run` in an agent session: they never exit.

### Layout

```
astro.config.mjs        site/base from SITE_URL / SITE_BASE, Preact + Tailwind
functions/api/eprel/    Cloudflare Pages Function (thin wrapper, logic lives in src/lib/eprel-proxy.ts)
public/                 favicon, _redirects (Cloudflare: /qr/* -> /qr/index.html)
src/layouts/Base.astro  <html lang="de">, viewport, title/description, noindex flag, optional analytics, nav + footer
src/pages/              one .astro file per route; sitemap.xml.ts and robots.txt.ts are endpoints
src/components/         Preact islands (*.tsx) and Astro partials
src/lib/                pure TypeScript logic + co-located *.test.ts
src/fixtures/           recorded EPREL JSON (e.g. eprel-1417304.json) for tests and the prerendered example
src/data/               build-time content (rule table, group page examples with fetch date)
```

Planned `src/lib` modules (see PLAN.md): `parse.ts` (registration number from URL/number), `rules.ts` (rule table + EPREL group prefix mapping), `deadline.ts` (`computeDeadline(group, onMarketEndDate, today)`), `eprel.ts` (types + field whitelist), `eprel-proxy.ts` (`handleEprelRequest(id, fetchImpl, env)` returning a `Response`), `letter.ts` (pure letter builder, **no fetch**), `format.ts` (dates as `TT.MM.JJJJ`), `affiliate.ts`, `url.ts`, `analytics.ts`, `sitemap.ts`.

### Conventions

- **Base path:** every internal href/src goes through `withBase('path')` from `src/lib/url.ts`. Never hard-code a leading `/`. In islands use `import.meta.env.BASE_URL` via the same helper.
- **Dates:** treat dates as calendar dates (`YYYY-MM-DD` strings or UTC midnight). EPREL returns arrays like `[2024,12,27]`. Display German format `27.12.2034`. Pass `today` into pure functions; never call `new Date()` inside them.
- **UI language** is German (du-form). Code, comments and tests in English.
- **Legal wording (RDG):** every result shows "Keine Rechtsberatung", the EPREL source link + fetch time, and that repair may cost an "angemessenes Entgelt". Never write "Ihr Anspruch besteht" or promise free repair; use "Laut EPREL-Daten und den EU-Ersatzteilregeln endet die Frist am …". No invented numbers (user counts, ratings, success rates).
- **Privacy:** no cookies, no localStorage of personal data, no third-party scripts except the optional analytics script. Letter fields and purchase date never leave the browser.
- **Env vars:** listed in `.env.example`. Browser-visible ones need the `PUBLIC_` prefix (`PUBLIC_ANALYTICS_*`, `PUBLIC_AFFILIATE_*`, `PUBLIC_EPREL_PROXY_URL`). Affiliate markup renders only when its var is set.
- **Analytics:** `track('lookup_success' | 'letter_created')` from `src/lib/analytics.ts`; no personal data in props.
- **Preview limits:** GitHub Pages has no functions, so live lookups there fail with the German 502 message. `/qr/1417304/` is prerendered from the fixture so the preview always shows a real result. `404.html` handles other `/qr/<n>` paths client-side on GitHub Pages.
- **Sitemap:** `src/pages/sitemap.xml.ts` lists every static page except 404, legal pages and `/qr/*` automatically.
