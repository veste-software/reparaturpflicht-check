import { affiliateSlots, type AffiliateInput } from '../lib/affiliate';

const env = {
  PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE: import.meta.env.PUBLIC_AFFILIATE_PARTS_URL_TEMPLATE as string | undefined,
  PUBLIC_AFFILIATE_REFURB_URL: import.meta.env.PUBLIC_AFFILIATE_REFURB_URL as string | undefined,
};

/** Optional help links below a result and the letter. Paid links render only when their env var is set. */
export default function AffiliateSlots(props: AffiliateInput & { testEnv?: typeof env }) {
  const slots = affiliateSlots(props, props.testEnv ?? env);
  const hasAd = slots.some((s) => s.sponsored);
  return (
    <section class="no-print mt-8" aria-labelledby="help-heading">
      <h2 id="help-heading" class="text-lg font-bold">Weitere Hilfe</h2>
      <ul class="mt-2 space-y-2">
        {slots.map((s) => (
          <li key={s.id}>
            <a
              class="underline"
              href={s.href}
              target="_blank"
              rel={s.sponsored ? 'sponsored nofollow noopener' : 'noopener noreferrer'}
            >
              {s.label}
            </a>
            {s.badge && <span class="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs">{s.badge}</span>}
          </li>
        ))}
      </ul>
      {hasAd && <p class="mt-2 text-xs text-slate-600">Anzeige / Affiliate-Link: Wir erhalten bei einem Kauf ggf. eine Provision.</p>}
    </section>
  );
}
