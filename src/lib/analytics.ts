/**
 * Cookie-free analytics events (Plausible-compatible API).
 * The script tag is only rendered when PUBLIC_ANALYTICS_DOMAIN and PUBLIC_ANALYTICS_SCRIPT_URL
 * are set (see src/layouts/Base.astro). Without them this is a silent no-op.
 * Never pass personal data (names, addresses, fault text, purchase dates) as props.
 */
export type AnalyticsEvent = 'lookup_success' | 'letter_created';

type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void;

export function track(event: AnalyticsEvent, props?: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  const plausible = (window as unknown as { plausible?: PlausibleFn }).plausible;
  if (typeof plausible === 'function') plausible(event, props ? { props } : undefined);
}
