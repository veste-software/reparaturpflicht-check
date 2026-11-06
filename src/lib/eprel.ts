/** Fields we use from EPREL. Everything else is dropped by `pickEprelFields`. */
export interface EprelContact {
  serviceName: string | null;
  organisationTitle: string | null;
  streetName: string | null;
  streetNumber: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  webSiteURL: string | null;
}

export interface EprelRecord {
  eprelRegistrationNumber: string | null;
  productGroup: string | null;
  modelIdentifier: string | null;
  supplierOrTrademark: string | null;
  /** `YYYY-MM-DD` */
  onMarketStartDate: string | null;
  /** `YYYY-MM-DD` */
  onMarketEndDate: string | null;
  energyClass: string | null;
  contactDetails: EprelContact | null;
  webLinkSupplier: string | null;
}

export const EPREL_FIELDS = [
  'eprelRegistrationNumber',
  'productGroup',
  'modelIdentifier',
  'supplierOrTrademark',
  'onMarketStartDate',
  'onMarketEndDate',
  'energyClass',
  'contactDetails',
  'webLinkSupplier',
] as const;

export const CONTACT_FIELDS = [
  'serviceName',
  'organisationTitle',
  'streetName',
  'streetNumber',
  'postalCode',
  'city',
  'country',
  'phone',
  'email',
  'webSiteURL',
] as const;

const pad = (n: number, len = 2) => String(n).padStart(len, '0');

/** EPREL dates arrive as `[2024,12,27]`; also accepts `YYYY-MM-DD` strings. */
export function eprelDate(value: unknown): string | null {
  if (Array.isArray(value) && value.length >= 3 && value.slice(0, 3).every((n) => Number.isInteger(n))) {
    const [y, m, d] = value as number[];
    return `${pad(y, 4)}-${pad(m)}-${pad(d)}`;
  }
  if (typeof value === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }
  return null;
}

function str(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
}

function pickContact(raw: unknown): EprelContact | null {
  if (!raw || typeof raw !== 'object') return null;
  const src = raw as Record<string, unknown>;
  const out = {} as Record<string, string | null>;
  for (const key of CONTACT_FIELDS) out[key] = str(src[key]);
  return out as unknown as EprelContact;
}

/** Whitelist: returns only the fields in SPEC §6.4, with dates as `YYYY-MM-DD`. */
export function pickEprelFields(raw: unknown): EprelRecord {
  const src = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    eprelRegistrationNumber: str(src.eprelRegistrationNumber),
    productGroup: str(src.productGroup),
    modelIdentifier: str(src.modelIdentifier),
    supplierOrTrademark: str(src.supplierOrTrademark),
    onMarketStartDate: eprelDate(src.onMarketStartDate),
    onMarketEndDate: eprelDate(src.onMarketEndDate),
    energyClass: str(src.energyClass),
    contactDetails: pickContact(src.contactDetails),
    webLinkSupplier: str(src.webLinkSupplier),
  };
}
