import { afterEach, describe, expect, it, vi } from 'vitest';
import { track } from './analytics';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('track', () => {
  it('is a silent no-op without window', () => {
    expect(() => track('lookup_success')).not.toThrow();
  });

  it('is a silent no-op when the analytics script is absent', () => {
    vi.stubGlobal('window', {});
    expect(() => track('letter_created')).not.toThrow();
  });

  it('calls window.plausible once per event without props', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    track('lookup_success');
    expect(plausible).toHaveBeenCalledTimes(1);
    expect(plausible).toHaveBeenCalledWith('lookup_success', undefined);
  });

  it('only fires named events', () => {
    const plausible = vi.fn();
    vi.stubGlobal('window', { plausible });
    track('letter_created');
    expect(plausible.mock.calls[0][0]).toBe('letter_created');
  });
});
