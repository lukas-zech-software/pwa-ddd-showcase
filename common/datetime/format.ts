/**
 * Pads a whole number < 10 with a zero
 * @param n the number to be padded
 */
export const zeroPadded = (n: number): string => {
  const floored = Math.floor(n);
  return floored < 10 ? `0${floored}` : String(floored);
};

/**
 * Pads a whole number < 10 with a zero and fixed to 2 decimal
 * @param n the number to be padded
 */
export const zeroPaddedFixed = (n: number): string => n < 10 ? `0${n.toFixed(2)}` : n.toFixed(2);

export const insertColon = (entryTime: number): string => {
  let stringified = String(entryTime);
  while (stringified.length < 4) {
    stringified = '0' + stringified;
  }
  return [stringified.slice(0, 2), ':', stringified.slice(2)].join('');
};
