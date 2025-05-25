export function laplaceNoise(scale: number): number {
  // Generate Laplace(0, scale) noise using inverse transform sampling
  const u = Math.random() - 0.5; // uniform(-0.5, 0.5)
  return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
} 