import { zeroPaddedFixed } from '@my-old-startup/common/datetime/format';
import { Monetary }        from '@my-old-startup/common/interfaces/types';

export function parseFloatDe(text = ''): number {
  return parseFloat(text.replace(',', '.'));
}

export function getHourText(hour: number): string {
  const smallHour = (hour / 100);

  return zeroPaddedFixed(smallHour).replace('.', ':');
}

export function parseMonetary(text: string): Monetary | undefined {
  const parsed = parseFloatDe(text);

  if (isNaN(parsed)) {
    return undefined;
  }

  const fixed = parsed.toFixed(2);
  return parseFloat(fixed) * 100;
}

/**
 * Capitalizes the first letter of a string
 * @param text
 */
export function capitalize(text: string | undefined): string | undefined {
  if (text === undefined || text === '') {
    return text;
  }

  const first = text[0];
  return first.toLocaleUpperCase() + text.slice(1);
}

export function cleanUrl(url: string): string {
  return 'https://' + url.replace(/https?:\/\//, '');
}
