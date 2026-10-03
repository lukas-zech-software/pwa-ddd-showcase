export function getLengthConstraintText(constraint: any): string {
  if (constraint && constraint.value) {
    return ` (aktuell ${constraint.value.length})`;
  }

  return '';
}
