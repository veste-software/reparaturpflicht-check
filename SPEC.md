# SPEC: Reparaturpflicht-Check

Product id: `reparaturpflicht-check` · Platform: web · UI language: German (de) · Spec date: 2026-11-06

---

## 1. Problem and users

**Users:** private consumers in Germany whose washing machine, washer-dryer, dishwasher, fridge/freezer, tumble dryer, TV/monitor, smartphone or tablet is broken and **out of the seller's 2-year warranty**.

**Problem:** since late July 2026 the manufacturer must repair these devices on request (§§ 479a ff. BGB). The obligation lasts as long as the EU ecodesign rules require spare parts, which is **7 or 10 years counted from the date the last unit of the model was placed on the EU market**, not from the purchase date. Every explainer says this, and none tells the consumer how to find that date. So the consumer cannot tell whether the manufacturer still has to repair the device, cannot cite a date, and doesn't know where to send the request.

**Job to be done:** "My device is broken. Does the manufacturer still have to repair it, until when, and how do I ask?" The answer should take under a minute and need no account.

## 2. Why now

- **Trigger:** the German law implementing Directive (EU) 2024/1799 (Right to Repair) added §§ 479a–479g BGB ("Reparaturverpflichtung des Herstellers"). Consumer bodies say the rules apply since **31 July 2026**. One legal database says the BGB change took effect on **23 July 2026** (law dated 16.07.2026, BGBl. I Nr. 212). The UI should say "seit Ende Juli 2026" unless the Builder confirms the exact date on gesetze-im-internet.de. Austria followed on 1 Oct 2026 and Italy on 7 Oct 2026, so the same need is spreading across the EU.
- **Window:** about 6 to 12 months. Today no German per-model lookup exists (see §4). The likeliest entrants are the Verbraucherzentralen, a price portal or a parts shop. The EU's own repair platform is not a per-model deadline tool.
- **Ship by:** **2026-11-13** (one-day prototype, live within a week).

## 3. Evidence (checked by me on 2026-11-06)

| What | Source | What I confirmed |
|---|---|---|
| Rules, periods, start of the period | https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/recht-auf-reparatur-mehr-rechte-seit-31-juli-2026-124253 (Stand 07.08.2026) | Direct claim against the manufacturer. Repair is not necessarily free ("angemessenes Entgelt"). Periods: dishwashers and fridges 7 or 10 years depending on the part, washing machines 10, tumble dryers 10, TVs/monitors 7, smartphones/tablets/cordless phones 7. The period runs from the **last unit of the model placed on the market** and cannot start before the spare-parts duty applied to the group (smartphones: 20 June 2025). Worked example: a smartphone sold Dec 2025 to Dec 2027 must have parts until Dec 2034. **No calculator, no model lookup, no sample letter.** |
| Same rules in a mass consumer outlet | https://www.t-online.de/heim-garten/haushaltstipps/haushaltsgeraete/id_101368584/recht-auf-reparatur-fuer-diese-geraete-muessen-hersteller-ersatzteile-liefern.html (updated 01.08.2026) | Same table. Purchase date irrelevant. **Does not say how to find the market end date.** No tool, no letter. |
| BGB paragraphs | search results from dejure.org, buzer.de and gesetze-im-internet.de (`/bgb/__479b.html`) | § 479a scope (dynamic reference to EU product groups), § 479b duty to repair on the consumer's request unless repair is factually or legally impossible, free or for a reasonable fee, § 479d information duties, § 479f importer/representative for non-EU manufacturers, § 479g no derogation. I saw snippets only: **Builder must check wording on gesetze-im-internet.de before quoting.** |
| **Data source works without a key** | `GET https://eprel.ec.europa.eu/api/product/1417304` (fetched today) | Returns public JSON for Bosch **WAJ240L2SN**, `productGroup: "washingmachines2019"`, `onMarketStartDate [2022,11,30]`, **`onMarketEndDate [2024,12,27]`**, `energyClass "B"`, `guaranteeDuration 24`, plus **`contactDetails`** (service name "Bosch Service", street, postcode, city, phone, e-mail), `webLinkSupplier`, `modelAvailabilityInCountries`. So the tool gives a real answer: parts and repair duty **until 27 Dec 2034**. |
| Bulk endpoint needs a key | `GET https://eprel.ec.europa.eu/api/products/washingmachines2019` returned **403**. The community proxy https://github.com/marcmarine/eprel-api-proxy says a key (`X-Api-Key`) is **not** needed for lookup by registration number. Key request page: https://eprel.ec.europa.eu/screen/requestpublicapikey | Brand/model **search** and bulk model pages need a public API key, which only the human can request. The MVP is designed around the keyless single-product endpoint. |
| End date is a legal duty, not optional | EPREL supplier guidance found in search (SEAI and Swedish Energy Agency guidelines) | The supplier must record in EPREL when it stops placing units of a model on the market. Some records will still have no end date or a far-future placeholder (a third-party sample shows `2050-12-31`). The tool must handle this honestly (see §6). |
| Energy labels carry the registration number | search results: manufacturer manuals/datasheets show links like `https://eprel.ec.europa.eu/qr/1417304` | Every post-2021 label (washers, dishwashers, fridges, displays; dryers and smartphones since 2025) has a QR code to `eprel.ec.europa.eu/qr/<number>`. That number is the input key. |

The Scout's November eco-design law item (biallo.de) I did not re-open. It only keeps the topic in the news and nothing here depends on it.

## 4. Positioning

**Gap in one sentence:** everyone explains that the manufacturer's repair duty runs "7 or 10 years from when the model left the market", but nobody tells you that date for *your* model. This tool reads it from the EU energy-label database and turns it into a concrete deadline plus a ready-to-send letter addressed to the manufacturer's service.

**Alternatives checked:**

| Name | URL | What it lacks |
|---|---|---|
| Verbraucherzentrale explainer | https://www.verbraucherzentrale.de/wissen/vertraege-reklamation/kundenrechte/recht-auf-reparatur-mehr-rechte-seit-31-juli-2026-124253 | Rules only: no per-model date, no calculator, no letter |
| t-online explainer (stands for all news explainers: winfuture, web.de, test.de, IHKs) | https://www.t-online.de/heim-garten/haushaltstipps/haushaltsgeraete/id_101368584/recht-auf-reparatur-fuer-diese-geraete-muessen-hersteller-ersatzteile-liefern.html | Same: no way to find the market end date |
| right-to-repair-check.pages.dev (Seller Guardrails) | https://right-to-repair-check.pages.dev/ | English only, product-group dropdown only. Answers "is my product group covered", gives **no date, no model lookup, no letter, no manufacturer contact** |
| EPREL public site | https://eprel.ec.europa.eu/ | Has the raw dates and contacts but does not compute the deadline, does not explain the right to repair, and is not a consumer guide |
| Bosch / Siemens (BSH) spare-parts pages | https://www.bosch-home.com/de/service/ersatzteile/waschmaschinen-ersatzteile | One brand. Gives a marketing claim ("bis zu 15 Jahre*"), not the legal per-model minimum |
| ersatzteilshop.de | https://www.ersatzteilshop.de/ersatzteile-fuer/whirlpool/geschirrspueler | Sells parts. Says nothing about the legal duty or deadline |

**What only this product does:** (1) takes the energy-label QR link or registration number, (2) shows the model, the last-placed-on-market date, the legal period and the **exact deadline**, or says honestly that the model is not covered or still on the market, (3) fills in a German repair-request letter with the manufacturer's **service address from EPREL**, (4) offers a URL swap: replace `eprel.ec.europa.eu/qr/` with `<domain>/qr/` and you land on your result.

**Copy hooks for Growth:** "Bis wann muss der Hersteller dein Gerät reparieren? QR-Code vom Energielabel einfügen, Datum sehen, Brief schicken." No promises of free repair: repair may cost a reasonable fee, and the copy must say so.

## 5. MVP scope

### In

1. **Lookup by registration number.** One input accepts either a full EPREL URL (`https://eprel.ec.europa.eu/qr/1417304`, `.../screen/product/<group>/1417304`) or a bare number. Parse the number and call our own serverless proxy `GET /api/eprel/<n>`, which fetches `https://eprel.ec.europa.eu/api/product/<n>` server-side (the browser cannot call EPREL directly). The proxy returns **only the fields we use** (whitelist), caches each record for 24 h at the edge, sends an identifiable User-Agent, and stores nothing.
2. **URL swap route `/qr/<n>`.** It renders the result for registration number n. Mark these pages `noindex` in the MVP.
3. **Deadline calculation** (a pure function, unit-tested) using the rule table below.
4. **Manual mode** for people without a number: pick the product group, then either "Modell wird noch verkauft" or a date "zuletzt in Verkehr gebracht", and get the same result logic. Also include a link plus short instructions for finding the number on the EPREL site.
5. **Warranty hint:** optional purchase date (kept in the browser only). If it is under 2 years ago, show first: "Zuerst kostenlos: Gewährleistung beim Verkäufer". Then show the manufacturer route.
6. **Letter generator (client-side only):** prefilled with model, registration number, deadline, legal basis and the manufacturer service address from `contactDetails`. The user adds name, address and fault description in the browser. Outputs: copy to clipboard, print / save as PDF via the print stylesheet, and a `mailto:` link to the EPREL contact e-mail. **No personal data leaves the browser.**
7. **Seven product-group pages** (see §8), each with the tool preset, the rule, a worked example built from a real EPREL record fetched at build time (with the fetch date), and a short FAQ.
8. `/musterbrief`, `/registriernummer-finden`, `/methodik` (sources, rule table with EUR-Lex links, data freshness, limits), `/impressum`, `/datenschutz`.
9. **Affiliate slots** on result pages (see §7), off unless env vars are set.
10. Cookie-free analytics (optional via env var) and two counted events: `lookup_success` and `letter_created`.

### Rule table (Builder: verify each row against EUR-Lex before shipping. If a row cannot be verified, show "7 oder 10 Jahre je nach Ersatzteil" without part lists)

| Gruppe (UI) | EPREL `productGroup` | Ecodesign regulation | Spare-parts duty applies to models on the market from | Period after last unit placed |
|---|---|---|---|---|
| Waschmaschine | `washingmachines2019` (verified) | (EU) 2019/2023 | 2021-03-01 | 10 years |
| Waschtrockner | expected `washerdryers2019` | (EU) 2019/2023 | 2021-03-01 | 10 years |
| Geschirrspüler | expected `dishwashers2019` | (EU) 2019/2022 | 2021-03-01 | 7 years (technical parts), 10 years (e.g. door hinge/seals, racks) |
| Kühl-/Gefriergerät | expected `refrigeratingappliances2019` | (EU) 2019/2019 | 2021-03-01 | 7 years (e.g. thermostats, sensors, boards, lights), 10 years (e.g. door handles/hinges, trays, gaskets) |
| Fernseher / Monitor | expected `electronicdisplays` | (EU) 2019/2021 | 2021-03-01 | 7 years |
| Wäschetrockner | expected prefix `tumbledryers` (2023 label) | (EU) 2023/2533 | 2025-07-01 | 10 years (per VZ table) |
| Smartphone / Tablet | expected prefix `smartphones` | (EU) 2023/1670 | 2025-06-20 | 7 years |
| Schnurlostelefon | not in EPREL, manual mode only | (EU) 2023/1670 | 2025-06-20 | 7 years |

Map EPREL groups by prefix, so that `washingmachines*` maps to Waschmaschine. An unknown group returns "Für diese Produktgruppe gibt es (noch) keine Ersatzteilfrist" plus a short note on groups that have a repair duty without a parts period (vacuum cleaners, certain batteries, data storage) per the Verbraucherzentrale.

**Result logic** (where `end` = onMarketEndDate, `app` = application date and `N` = years):
- `end` missing, or `end` ≥ today + 3 years (placeholder such as 2050-12-31): **"Wird laut EPREL noch in Verkehr gebracht"**. The duty runs **at least until today + N** and ends N years after the manufacturer stops selling the model.
- `end` < `app`: **"Wahrscheinlich nicht erfasst"**, because the last unit was placed before the spare-parts duty applied. Explain this and point to the warranty and voluntary manufacturer offers.
- otherwise: deadline = `end` + N years. If the deadline is in the future, show **"Hersteller muss reparieren bis TT.MM.JJJJ"**. If it has passed, show **"Frist abgelaufen am …"**.
- Always show: the EPREL source link, the fetch timestamp, that repair may cost a reasonable fee, and the line "Keine Rechtsberatung".

### Out (explicitly not in the MVP)

- Brand + model **text search** and pre-rendered per-model pages. Both need the EPREL public API key, so they are **phase 2** after the human obtains a key.
- Any account, login, saved letters or server-side storage of personal data.
- Sending letters by post or registered mail (a possible later paid feature, see §7).
- Repair-cost estimates, repair-shop directory, reviews.
- Other countries and languages (phase 3: AT first, same BGB-like logic, then other EU languages).
- Display ads (need consent management).
- Barcode/QR scanning via camera. Users paste the link their phone camera already opens.

## 6. Acceptance criteria (QA checks these without accounts or keys)

1. `npm run build` and `npm test` pass. No secrets in the repo, and `.env.example` lists every env var.
2. The unit-tested function `computeDeadline(group, onMarketEndDate, today)` returns:
   - washing machine, end 2024-12-27 → covered, deadline **2034-12-27**
   - smartphone, end 2027-12-15 → deadline 2034-12-15 (VZ example: Dec 2025 to Dec 2027 gives Dec 2034)
   - dishwasher, end 2020-06-30 → "not covered" (before 2021-03-01)
   - washing machine, end null → "still on market", minimum = today + 10 years
   - washing machine, end 2050-12-31 → "still on market" (placeholder handling)
   - TV, end 2021-05-01, today 2029-01-01 → "expired on 2028-05-01"
   - unknown group `lightsources` → "no parts period" message
3. The input parser accepts `1417304`, ` 1417304 `, `https://eprel.ec.europa.eu/qr/1417304`, `eprel.ec.europa.eu/qr/1417304?x=1` and `https://eprel.ec.europa.eu/screen/product/washingmachines2019/1417304`, and returns 1417304 each time. Non-numeric input shows a German error message, not a crash.
4. A recorded fixture of the real EPREL response for `1417304` is committed. The proxy handler test, run against that fixture with fetch mocked, returns only whitelisted fields: `eprelRegistrationNumber, productGroup, modelIdentifier, supplierOrTrademark, onMarketStartDate, onMarketEndDate, energyClass, contactDetails (serviceName, organisationTitle, streetName/streetNumber, postalCode, city, country, phone, email, webSiteURL), webLinkSupplier`.
5. The proxy returns 400 for a non-numeric id, 404 with a German message when EPREL has no product, and 502 with a German message when EPREL is unreachable. No stack traces reach the client.
6. The rendered result for the fixture shows "Bosch", "WAJ240L2SN", "27.12.2024", "27.12.2034", "Bosch Service" and "München", plus a link to `https://eprel.ec.europa.eu/qr/1417304`.
7. `/qr/1417304` renders the same result and has `<meta name="robots" content="noindex">`.
8. Manual mode works with JavaScript-computed results only (no network call): Waschmaschine + "zuletzt verkauft 2024-12-27" gives 27.12.2034.
9. With a purchase date under 2 years before today, the warranty hint appears above the manufacturer result.
10. The letter contains model, registration number, deadline, "§ 479b BGB" (only if the Builder verified the wording; otherwise "§§ 479a ff. BGB"), the manufacturer address from the fixture, the user's typed name and fault text, and a sentence asking for a cost estimate (Kostenvoranschlag) before the repair. Generating it makes **no network request** (verified by test or by code review: no fetch in the letter module).
11. Seven product-group pages exist, each with ≥ 300 words of specific content (rule, period, start date, worked example with a real EPREL record and its fetch date, FAQ), a preset tool and a unique `<title>` and meta description. No two pages share more than the shared FAQ block.
12. `/musterbrief`, `/registriernummer-finden`, `/methodik`, `/impressum`, `/datenschutz` exist. The Impressum and Datenschutz pages are marked as drafts with placeholders for operator data.
13. Every result shows "Keine Rechtsberatung", the data source and fetch time, and the line that repair may cost a reasonable fee. No page promises free repair.
14. No cookies are set (check the build output and scripts: there are no cookie writes and the analytics, if present, are cookie-free). The page contains no third-party script other than the optional analytics.
15. Affiliate slots render only when their env vars are set, use `rel="sponsored nofollow noopener"`, and are labelled "Anzeige" or "Affiliate-Link". With the env vars unset, no affiliate markup appears.
16. `sitemap.xml` lists the home page, the 7 group pages, `/musterbrief`, `/registriernummer-finden` and `/methodik`, and excludes `/qr/*`. `robots.txt` exists.
17. Lighthouse-style basics: each page has one `<h1>`, `lang="de"` and a viewport meta tag, and works at 360 px width.
18. No UI text contains invented numbers: no user counts, success rates or reviews.

## 7. Monetisation

**Model: free tool + affiliate links (primary).** The visitor arrives with a broken device and high purchase intent: they will buy a spare part, pay a repair, or replace the device. A paywall on the deadline would kill the search and share value, and the letter must stay free to be credible.

- **Free:** everything (lookup, deadline, letter, group pages).
- **Affiliate slots** (only on result pages and group pages, below the deadline and letter, never above them, and clearly labelled):
  1. "Ersatzteil selbst bestellen" links to a spare-parts shop partner, deep-linked with the model identifier if the program allows it. Env: `AFFILIATE_PARTS_URL_TEMPLATE` (with a `{model}` placeholder).
  2. "Reparatur lohnt sich nicht? Generalüberholt kaufen" links to a refurbished-device partner. Env: `AFFILIATE_REFURB_URL`. Shown only for smartphone/tablet/TV and for "expired"/"not covered" results.
  3. A non-affiliate link "Reparaturcafé oder Fachbetrieb in der Nähe", kept for trust.
- **Prices:** free to the user. Commission rates depend on the programs the human joins. I have not verified any rates, so none are assumed here.
- **Later paid option (phase 2, human decision):** "Brief per Einschreiben versenden" for about €4.90 per letter via a print-and-mail API, with Stripe in test mode first. Not in the MVP because it requires processing name and address server-side.
- **No display ads in the MVP** (they would need a consent banner). Revisit if traffic exceeds roughly 10k visits per month.

## 8. Target queries and page plan

Search volumes are not verified. These are the queries a user with a broken device would type, taken from the Scout plus my own searches.

| Query | Page | What the page delivers |
|---|---|---|
| recht auf reparatur bis wann · wie lange muss hersteller reparieren · reparaturpflicht hersteller | `/` | The tool (QR link or number, manual mode), result logic, a short rules box |
| recht auf reparatur waschmaschine wie lange · ersatzteile pflicht wie lange waschmaschine | `/waschmaschine` | 10-year rule, start date 1 March 2021, worked example (WAJ240L2SN gives 27.12.2034), tool preset |
| recht auf reparatur geschirrspüler · ersatzteile geschirrspüler wie lange | `/geschirrspueler` | 7/10 split explained, example, tool |
| recht auf reparatur kühlschrank · ersatzteile kühlschrank pflicht | `/kuehlschrank` | 7/10 split, example, tool |
| recht auf reparatur trockner | `/trockner` | 10 years, duty only since 1 July 2025, so older models are likely not covered (explained) |
| recht auf reparatur fernseher · monitor ersatzteile pflicht | `/fernseher-monitor` | 7 years, example, tool |
| recht auf reparatur smartphone wie lange · handy ersatzteile 7 jahre | `/smartphone-tablet` | 7 years from 20 June 2025, VZ worked example, tool, refurbished slot |
| recht auf reparatur waschtrockner | `/waschtrockner` | 10 years, example, tool |
| recht auf reparatur musterbrief · reparatur beim hersteller verlangen · hersteller verweigert reparatur | `/musterbrief` | Letter generator (manual fields), what to do on refusal (only the impossibility exception exists) |
| eprel nummer finden · energielabel qr code bedeutung | `/registriernummer-finden` | Where the number is (label QR, datasheet, manual, EPREL search) and the URL-swap trick |
| [modellnummer] ersatzteile bis wann | phase 2: `/modell/<group>/<model>` pre-rendered from EPREL bulk data (needs API key) | One page per covered model with real dates, deadline, service contact and letter. This is the long-tail programmatic play that matches the studio's only traction pattern. MVP URLs are designed so phase 2 fits in. |

## 9. Success metrics and kill criteria

Launch is assumed on 2026-11-13. All numbers come from Search Console and cookie-free analytics, never invented.

- **Signal of life:** ≥ 100 `lookup_success` events and ≥ 20 `letter_created` events by **2027-01-12**.
- **Search:** ≥ 50 organic clicks per 28 days by **2027-02-11**, with at least one group page in the top 20 for its query.
- **Kill (MVP):** fewer than **100 organic clicks in total 60 days after launch (2027-01-12)** AND fewer than 50 lookups → stop and archive.
- **Kill (phase 2 gate):** if the EPREL API key cannot be obtained by **2027-01-31**, do not build programmatic model pages. Keep the MVP running only if it meets the search metric above.
- **Kill (money):** affiliate revenue below **€20 in total by 2027-05-13** (6 months) → stop investing time and leave the site running only while hosting stays free.

## 10. Legal and platform notes

- **Stack (Architect decides details):** a static site plus **one serverless function** (e.g. Cloudflare Pages Function) for `/api/eprel/<n>`. Free tier, no database, no VPS.
- **RDG / legal information:** the tool gives general legal information and a template letter. It does not assess individual cases or give advice. Put "Keine Rechtsberatung" on every result. Do not use wording like "Ihr Anspruch besteht" or anything else that sounds like a case assessment. Use "Laut EPREL-Daten und den EU-Ersatzteilregeln endet die Frist am …". **Have a lawyer review the letter text, the result wording and the legal pages.**
- **Data accuracy:** EPREL data is entered by suppliers and can be wrong or missing. Always show the source, the registration number link and the fetch time, and explain the placeholder and missing-date cases.
- **EPREL usage:** the MVP calls only the keyless single-product endpoint, one request per user lookup, cached 24 h, with an identifiable User-Agent. No crawling of number ranges and no bulk scraping. The official API terms PDF (`https://ec.europa.eu/assets/move-ener/eprel/EPREL%20Public/Public%20API%20Term%20and%20Conditions/API_TERMS_AND_CONDITIONS_EN.pdf`) could not be read by me. **A human must read it** before phase 2 and before any commercial use beyond affiliate links. Attribute "Datenquelle: EPREL, Europäische Kommission".
- **Privacy (DSGVO):** no cookies, no accounts. Letter data and purchase date stay in the browser. The proxy logs no IPs beyond the host's defaults, which the Datenschutz draft must describe. Analytics must be cookie-free, or omitted.
- **Affiliate law:** label every affiliate link ("Anzeige"/"Affiliate-Link"). No fake urgency, no ratings, no counters.
- **Imprint:** Impressum and Datenschutzerklärung are required as drafts with placeholders for the operator's data.
- **Trademarks:** brand names appear only as factual model data from EPREL. No logos.

## 11. Human tasks

1. Register a domain and connect Cloudflare Pages (or the chosen host). Set the env vars from `.env.example`.
2. Fill in the operator data in the Impressum and Datenschutz drafts, then **have a lawyer review the legal pages, the letter template and the result wording (RDG)**.
3. Read the EPREL Public API terms and request a public API key at https://eprel.ec.europa.eu/screen/requestpublicapikey (it may require an electronic seal or signature). Store it as `EPREL_API_KEY`. It is needed only for phase 2.
4. Apply to affiliate programs for one spare-parts shop and one refurbished-device seller, check their terms, and set `AFFILIATE_PARTS_URL_TEMPLATE` and `AFFILIATE_REFURB_URL`.
5. Optionally create a cookie-free analytics account (e.g. Plausible or Cloudflare Web Analytics) and set `ANALYTICS_*`.
6. Add the site to Google Search Console and submit `sitemap.xml`. Copy the numbers into `metrics.json` monthly.
