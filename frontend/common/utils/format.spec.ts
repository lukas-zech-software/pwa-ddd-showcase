import {
  capitalize,
  parseMonetary,
} from './format';

describe('parseMonetary', () => {
  test('NaN should return undefined', () => {
    expect(parseMonetary('foo')).toBe(undefined);
  });

  test('empty strings should return undefined', () => {
    expect(parseMonetary('')).toBe(undefined);
  });

  test('decimal is parsed correctly', () => {
    expect(parseMonetary('1.23')).toBe(123);
  });

  test('whole number is assumed to be whole euros', () => {
    expect(parseMonetary('10')).toBe(1000);
  });

  test('prefix dot assumed to be cents', () => {
    expect(parseMonetary('.10')).toBe(10);
  });

  test('handles commas like dots', () => {
    expect(parseMonetary('1,23')).toBe(123);
  });
});

describe('capitalize', () => {
  it('should capitalize the first letter', () => {
    expect(capitalize('foo')).toBe('Foo');
  });

  it('should accept undefined and pass that through', () => {
    expect(capitalize(undefined)).toBeUndefined();
  });

  it('should return an empty string if provided', () => {
    expect(capitalize('')).toBe('');
  });
});
