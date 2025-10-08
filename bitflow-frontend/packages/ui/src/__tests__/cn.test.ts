import { describe, it, expect } from 'vitest';
import { cn } from '../lib/cn';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    const result = cn('base', 'override');
    expect(result).toContain('base');
    expect(result).toContain('override');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible');
    expect(result).toContain('base');
    expect(result).toContain('visible');
    expect(result).not.toContain('hidden');
  });
});
