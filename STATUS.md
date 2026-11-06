# Reparaturpflicht-Check

**Stage:** seo · **Platform:** web · **Score:** 3.3/5 · **Spend:** $5.96

For people in Germany (later DACH and the EU) with a broken washing machine, dishwasher, fridge, dryer, TV/monitor, smartphone or tablet: enter brand and model and see until when the manufacturer must repair it under the new right to repair, computed from the model's EU database market dates plus the legal spare-parts period, with the manufacturer's repair contact and a ready-to-send repair request letter.

**Why now:** The German law implementing the EU right-to-repair directive applies: manufacturers must repair covered products for as long as spare parts must be kept (7 or 10 years), counted from when the last unit of the model was placed on the market, not from the purchase date (2026-07-31). Window: Six to twelve months. The law is three months old and the only open question for consumers (when did my model leave the market?) has no tool yet. Consumer bodies, price portals, spare-parts shops or EPREL itself could add a lookup, and covered product groups grow as new ecodesign rules arrive. Searches run: 'Recht auf Reparatur Rechner ...', 'Ersatzteilpflicht bis wann Modellnummer prüfen online Tool', 'Hersteller verweigert Reparatur ... Musterbrief': no calculator or per-model lookup found.

## Needs you

- [ ] [task 1] Register a domain and connect Cloudflare Pages (or chosen host); set env vars from .env.example
- [ ] [task 2] Fill operator data into Impressum and Datenschutz drafts
- [ ] [task 3] Have a lawyer review the legal pages, the repair-request letter template and the result wording (RDG)
- [ ] [task 4] Read the EPREL Public API terms and request a public API key at https://eprel.ec.europa.eu/screen/requestpublicapikey; store as EPREL_API_KEY (phase 2 only)
- [ ] [task 5] Apply to one spare-parts shop and one refurbished-device affiliate program; set AFFILIATE_PARTS_URL_TEMPLATE and AFFILIATE_REFURB_URL
- [ ] [task 6] Optionally set up cookie-free analytics (Plausible or Cloudflare Web Analytics) and set ANALYTICS_* env vars
- [ ] [task 7] Add the site to Google Search Console, submit sitemap.xml, and copy the monthly numbers into metrics.json
- [ ] [task 8] Register a domain, connect Cloudflare Pages (build command npm run build, output dist, Functions enabled) and set SITE_URL plus the env vars from .env.example
- [ ] [task 9] Fill in operator data in the Impressum and Datenschutz drafts and have a lawyer review the legal pages, the letter template and the result wording (RDG)
- [ ] [task 10] Read the EPREL Public API terms and request a public API key at https://eprel.ec.europa.eu/screen/requestpublicapikey; store it as EPREL_API_KEY (phase 2 only)
- [ ] [task 11] Join one spare-parts and one refurbished-device affiliate program and set PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE and PUBLIC_AFFILIATE_REFURB_URL
- [ ] [task 12] Optionally create a cookie-free analytics site (e.g. Plausible) and set PUBLIC_ANALYTICS_DOMAIN and PUBLIC_ANALYTICS_SCRIPT_URL
- [ ] [task 13] Add the site to Google Search Console and submit sitemap.xml
- [ ] [task 14] Blocked: A1 Fixture: fetch https://eprel.ec.europa.eu/api/product/1417304 and commit it as src/fixtures/eprel-1417304.json with a meta file (Network access is denied in the builder sandbox. A hand-written fixture would be invented data. A human must fetch the response once and add the fetch timestamp. A5, A7, A8, B4, B5 and C1+ depend on it.)
- [ ] [task 15] Blocked: A1 Fixture (and therefore A7, A8, B4, B5, C1+ acceptance tests) (The sandbox has no network access, so the real EPREL response for 1417304 cannot be fetched. A human must run curl https://eprel.ec.europa.eu/api/product/1417304 and commit the output as src/fixtures/eprel-1417304.json plus a .meta.json with the fetch time.)
- [ ] [task 16] Blocked: A8b Prerendered /qr/1417304 page and 'Beispiel ansehen' link; fixture-based assertions (SPEC 6.6/6.7) (Needs the real EPREL response src/fixtures/eprel-1417304.json (A1). The sandbox denies network access and a hand-written fixture would be invented data. A human must fetch https://eprel.ec.europa.eu/api/product/1417304 once and add the meta file.)
- [ ] [task 17] Blocked: A1 Fixture and A8b prerendered /qr/1417304 (The sandbox has no network access to eprel.ec.europa.eu; a human must fetch https://eprel.ec.europa.eu/api/product/1417304 once and commit it as src/fixtures/eprel-1417304.json plus the meta file.)
- [ ] [task 18] Blocked: C3/C4 other group pages with real EPREL example records (Needs real registration numbers from manufacturer datasheets and network access to EPREL; not available in the sandbox and must not be invented. A human should run scripts/refresh-fixtures.mjs with real numbers.)
- [ ] [task 19] Blocked: C3/C4 real EPREL example records and EPREL group-name confirmation (Network access is blocked in the sandbox, so real registration numbers and records could not be found or fetched; pages use computed examples instead.)
- [ ] [task 20] Blocked: E3 Performance basics (JS gzip size) and E4 Final pass (Bash was denied in this session, so npm test, build, lint, build:preview, check:dist and the gzip size check could not be run. A session with shell access is needed.)
- [ ] [task 21] Blocked: E3 Performance basics: measure total JS gzip size on / (< 50 KB) (Bash is denied in this environment, so the build and gzip sizes of dist/_astro could not be measured.)
- [ ] [task 22] Blocked: E4 Final pass: run test, lint, build, build:preview, check:dist and walk SPEC §6 items 1-18 (Bash is denied in this environment, so none of the commands could be run.)

## Recommendation

None yet. The Growth role gives one after launch.

## Metrics

No real numbers yet. Fill in `metrics.json` (Search Console, analytics, Stripe); agents never invent them.

## Monetisation

Free tool with clearly labelled affiliate links (Free for users; affiliate commissions from a spare-parts shop and a refurbished-device seller (rates unverified, depend on programs the human joins); optional later paid add-on 'Brief per Einschreiben versenden' at about 4.90 EUR, not in MVP)

## Target queries

- recht auf reparatur bis wann
- wie lange muss hersteller reparieren
- reparaturpflicht hersteller
- recht auf reparatur waschmaschine wie lange
- ersatzteile pflicht wie lange waschmaschine
- recht auf reparatur geschirrspüler
- recht auf reparatur kühlschrank
- recht auf reparatur trockner
- recht auf reparatur fernseher
- recht auf reparatur smartphone wie lange
- recht auf reparatur musterbrief
- reparatur beim hersteller verlangen
- hersteller verweigert reparatur
- eprel nummer finden
- [modellnummer] ersatzteile bis wann

## Alternatives found

- Verbraucherzentrale explainer (partial): Explains the rule only. No per-model date, no calculator, no letter.
- EPREL (EU energy label database) (partial): Holds model data but does not translate it into a repair-obligation deadline, and gives no consumer guidance in German.
- Bosch/BSH spare-parts search (partial): One brand only, shows voluntary marketing periods (e.g. up to 15 years) instead of the legal obligation per model.
- ersatzteilshop.de model pages (partial): Sells parts per model number. Says nothing about the manufacturer's legal repair duty or deadline.

## Kill criteria

- Fewer than 100 organic clicks in total and fewer than 50 lookups by 2027-01-12 (60 days after launch): stop and archive
- Fewer than 50 organic clicks per 28 days by 2027-02-11: no further investment
- No EPREL public API key by 2027-01-31: do not build programmatic model pages
- Affiliate revenue below 20 EUR in total by 2027-05-13: stop investing time

## Links

- Repo: https://github.com/veste-software/reparaturpflicht-check
- Preview (GitHub Pages, builds from main): https://veste-software.github.io/reparaturpflicht-check/

## History

- 2026-11-06 08:40 · scouted · picked from the bench: score 3.3, under the usual 3.5; the review panel is skipped, the prototype is how it is judged
- 2026-11-06 08:47 · specced · spec written
- 2026-11-06 08:58 · planned · scaffold and plan written
- 2026-11-06 09:05 · building · build started
- 2026-11-06 10:06 · parked · the builder made no progress in 2 runs in a row (2 tasks still open)
- 2026-11-06 10:15 · seo · resumed by the operator
