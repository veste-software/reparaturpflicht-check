import { describe, expect, it } from 'vitest';
import { GROUP_CONTENT, groupWordCount } from './groups';
import { groupById } from '../lib/rules';

describe('group content', () => {
  it('maps every page to a rule group with the same slug', () => {
    for (const c of GROUP_CONTENT) expect(groupById(c.id)?.slug).toBe(c.slug);
  });
  it('has unique titles and descriptions', () => {
    expect(new Set(GROUP_CONTENT.map((c) => c.title)).size).toBe(GROUP_CONTENT.length);
    expect(new Set(GROUP_CONTENT.map((c) => c.description)).size).toBe(GROUP_CONTENT.length);
  });
  it('has at least 300 words of group-specific text each', () => {
    for (const c of GROUP_CONTENT) expect(groupWordCount(c), c.slug).toBeGreaterThanOrEqual(300);
  });
});
