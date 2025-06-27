export function getDistance(distance: number): string {
  if (distance === 0) {
    // still Loading
    return '';
  }
  if (distance > 1) {
    return `${distance.toFixed(1)} km`;
  }
  return `${Math.ceil(distance * 1000)} m`;
}
