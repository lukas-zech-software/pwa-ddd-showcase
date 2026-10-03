import {
  insertColon,
  zeroPadded,
} from './format';

describe('zeroPadded', () => {
  test('should not touch inputs greater than 10', () => {
    const ten     = 10,
          hundred = 100;

    expect(zeroPadded(ten)).toBe(String(ten));
    expect(zeroPadded(hundred)).toBe(String(hundred));
  });

  test('should pad small numbers', () => {
    const zero = 0,
          one  = 1,
          nine = 9;

    expect(zeroPadded(zero)).toBe('00');
    expect(zeroPadded(one)).toBe('01');
    expect(zeroPadded(nine)).toBe('09');
  });

  test('should truncate decimals', () => {
    const one       = 1.1,
          nine      = 9.9,
          eleven    = 11.11,
          fiftyFive = 55.55;

    expect(zeroPadded(one)).toBe('01');
    expect(zeroPadded(nine)).toBe('09');
    expect(zeroPadded(eleven)).toBe('11');
    expect(zeroPadded(fiftyFive)).toBe('55');
  });
});

describe('insertColon', () => {
  test('should insert colon in 4 digit number', () => {
    const n = 1234;

    const formatted = insertColon(n);

    expect(formatted).toBe('12:34');
  });

  test('should prepend zeros if necessary', () => {
    const one   = 1;
    const two   = 11;
    const three = 111;

    expect(insertColon(one)).toBe('00:01');
    expect(insertColon(two)).toBe('00:11');
    expect(insertColon(three)).toBe('01:11');
  });
});
