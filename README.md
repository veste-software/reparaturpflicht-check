# Reparaturpflicht-Check

For people in Germany (later DACH and the EU) with a broken washing machine, dishwasher, fridge, dryer, TV/monitor, smartphone or tablet: enter brand and model and see until when the manufacturer must repair it under the new right to repair, computed from the model's EU database market dates plus the legal spare-parts period, with the manufacturer's repair contact and a ready-to-send repair request letter.

MVP input: the EPREL registration number or the energy-label QR link (`eprel.ec.europa.eu/qr/<n>`); brand/model search is phase 2.

## Development

Astro + Tailwind + Preact, one Cloudflare Pages Function for the EPREL proxy. Node 22+.

```sh
npm ci
npm test               # vitest run
npm run build          # static site in dist/
npm run build:preview  # same, under the /preview sub-path
npm run lint           # astro check
```

Environment variables: see `.env.example`. Details for contributors: `CLAUDE.md`.

Built by an automated studio. Current state, open decisions and metrics are in [STATUS.md](STATUS.md). What the product is and why is in [SPEC.md](SPEC.md).
