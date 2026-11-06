# Growth plan: Reparaturpflicht-Check

Status 2026-11-06 (prep). No traffic, no Search Console data yet. Search volumes are unverified; nothing below claims any.

## Done in prep (on-page / technical)
- Unique, query-first titles (about 50 characters) for the 7 group pages, e.g. "Recht auf Reparatur Waschmaschine: Frist prüfen"; home keeps "Reparaturpflicht-Check: Bis wann muss der Hersteller reparieren?".
- Base layout: canonical (indexable pages), Open Graph and Twitter tags, `sitemap` link, `lang="de"`.
- Structured data, only where true: `WebApplication` (home, price 0 EUR, no ratings), `BreadcrumbList` (all other indexable pages), `FAQPage` (group pages; the FAQ is visible on the page).
- `sitemap.xml` and `robots.txt` exist; `/qr/*` stays `noindex` and out of the sitemap.
- Monetisation: affiliate slots stay off until the env vars are set (see `.env.example`). No paywall, no display ads (would need consent).
- Analytics: cookie-free, events `lookup_success` and `letter_created`, enabled by `PUBLIC_ANALYTICS_*`.

## Queries and pages
| Query cluster | Page | Status |
|---|---|---|
| recht auf reparatur bis wann / reparaturpflicht hersteller | `/` | tool + rules |
| ... waschmaschine / geschirrspüler / kühlschrank / waschtrockner / wäschetrockner / fernseher / smartphone | 7 group pages | live in build |
| reparatur brief hersteller muster | `/musterbrief` | live |
| eprel nummer finden / energielabel qr | `/registriernummer-finden` | live |
Not served: brand + model text queries ("Bosch WAJ240L2SN ersatzteile bis wann"). They need an EPREL public API key; no thin pages are faked.

## 30-day plan
Week 1 (launch)
- Human: submit the site to Google Search Console and Bing Webmaster Tools (verify domain, submit `sitemap.xml`, request indexing for `/` and the 7 group pages; Bing gives IndexNow).
- Set analytics env vars; check that both events fire.
- Check `view-source` of the live home page for the JSON-LD and OG tags; test with Google's Rich Results Test.
Week 2
- Human: request the EPREL public API key (https://eprel.ec.europa.eu/screen/requestpublicapikey). This unlocks phase 2: model-specific pages for the most common models, only with real EPREL data and a real answer each (no mass thin pages).
- Post an honest "I built this" in communities where the topic is on-topic and self-promotion rules allow it (read each ruleset first): r/de, r/Finanzen-adjacent consumer threads, r/de_EDV, mydealz (Forum), Reparatur-Initiative / Repair-Café forums, Reddit r/righttorepair. Lead with the problem (nobody tells you the date for your model), not with the link.
Week 3
- Outreach by email, one per person: Repair-Cafés and Reparatur-Initiativen (a tool they can hand to visitors), consumer bloggers and journalists who wrote the "Recht auf Reparatur" explainers (offer the QR-link trick: replace `eprel.ec.europa.eu/qr/` with our domain `/qr/`). Offer the Verbraucherzentrale a correction-friendly contact for the methodology page.
- Directories that fit: Produkthunt (DE launch), AlternativeTo, netzwelt/Chip-style tool lists only if they accept free tools. Human task.
Week 4
- Review Search Console: rewrite titles for pages with impressions but low CTR; add the "wird ein Gerät noch verkauft" FAQ if queries ask it.
- Next pages, only if queries show demand: `/waschmaschine-ersatzteile-pflicht`-style pages are NOT planned (duplicates). Candidates with distinct content: "Reparatur lohnt sich nicht? Kosten und Alternativen", Austria version (AT law in force 1 Oct 2026, per SPEC; verify first).

## Risks
- Window is 6 to 12 months; the Verbraucherzentralen could add a lookup. Speed matters more than polish.
- Free tool copyable in a weekend: the moat is the EPREL parsing, correct rule table, and the letter; phase 2 model pages and a paid registered-mail letter (human decision, Stripe test mode first) are the paid path.
- Do not use claims about user counts or success rates anywhere.
