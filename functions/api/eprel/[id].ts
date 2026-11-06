import { handleEprelRequest, type ProxyEnv } from '../../../src/lib/eprel-proxy';

// Minimal local types: no Cloudflare SDK needed.
interface EdgeCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}
interface Context {
  request: Request;
  params: { id?: string | string[] };
  env: ProxyEnv;
  waitUntil(promise: Promise<unknown>): void;
}

export const onRequestGet = async (context: Context): Promise<Response> => {
  const id = Array.isArray(context.params.id) ? context.params.id[0] : (context.params.id ?? '');
  const cache = (globalThis as unknown as { caches?: { default?: EdgeCache } }).caches?.default;
  const key = new Request(new URL(context.request.url).toString(), { method: 'GET' });

  const hit = await cache?.match(key);
  if (hit) return hit;

  const response = await handleEprelRequest(id, fetch, context.env);
  if (response.status === 200 && cache) context.waitUntil(cache.put(key, response.clone()));
  return response;
};
