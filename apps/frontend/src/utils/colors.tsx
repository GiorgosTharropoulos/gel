export function blendWithGray(hex: string, factor: number): string {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  const r = Math.floor((num >> 16) * (1 - factor) + 128 * factor);
  const g = Math.floor(((num >> 8) & 0x00ff) * (1 - factor) + 128 * factor);
  const b = Math.floor((num & 0x0000ff) * (1 - factor) + 128 * factor);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
