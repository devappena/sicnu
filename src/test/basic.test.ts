import { describe, it, expect } from 'vitest';

describe('Basic Test Setup', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should work with strings', () => {
    const message = 'Hello ENA Portail RH';
    expect(message).toContain('ENA');
  });

  it('should work with arrays', () => {
    const fruits = ['pomme', 'banane', 'orange'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('pomme');
  });
});
