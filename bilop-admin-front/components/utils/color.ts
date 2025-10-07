// Utilidades para manejo de colores y contraste WCAG AA

// Calcula la luminancia relativa de un color hexadecimal
export function getLuminance(hex: string): [number, number, number] {
  const rgb = hex.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [1,1,1];
  return rgb.map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)) as [number, number, number];
}

// Calcula el ratio de contraste entre dos colores hexadecimales
export function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = getLuminance(hex1);
  const [r2, g2, b2] = getLuminance(hex2);
  const L1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const L2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
} 