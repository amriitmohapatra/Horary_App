/** WGS84 geocentric latitude: tan φ′ = (1 − f)² tan φ (Solar Fire option, knowledge/03). */
export function geocentricLatitude(latDeg: number): number {
  const f = 1 / 298.257223563;
  return (Math.atan(Math.tan((latDeg * Math.PI) / 180) * (1 - f) * (1 - f)) * 180) / Math.PI;
}
