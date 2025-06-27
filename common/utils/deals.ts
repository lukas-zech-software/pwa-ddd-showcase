export function getDiscount(part: number, all: number): number {
  const discount = all - (all / 100 * part);

  return Math.max(0, discount);
}

export function getMinMax(value = 0): number {
  if (isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

export function getPercent(part: number, all: number): number {
  const discountedAmount = all - part;
  const percent          = Math.round(discountedAmount / all * 100);

  return getMinMax(percent);
}
