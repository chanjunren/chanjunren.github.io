// Dot matrix fonts at multiple sizes
// Each row is a bitmask — MSB = leftmost dot

export const FONTS = {
  // 3x5 — ultra compact micro pixel font
  micro: {
    width: 3,
    height: 5,
    gap: 1,
    glyphs: {
      A: [0b010, 0b101, 0b111, 0b101, 0b101],
      B: [0b110, 0b101, 0b110, 0b101, 0b110],
      E: [0b111, 0b100, 0b110, 0b100, 0b111],
      H: [0b101, 0b101, 0b111, 0b101, 0b101],
      M: [0b101, 0b111, 0b101, 0b101, 0b101],
      O: [0b010, 0b101, 0b101, 0b101, 0b010],
      T: [0b111, 0b010, 0b010, 0b010, 0b010],
      U: [0b101, 0b101, 0b101, 0b101, 0b010],
      Z: [0b111, 0b001, 0b010, 0b100, 0b111],
      " ": [0b000, 0b000, 0b000, 0b000, 0b000],
    } as Record<string, number[]>,
  },

  // 5x5 — square chunky pixel font
  square: {
    width: 5,
    height: 5,
    gap: 1,
    glyphs: {
      A: [0b01110, 0b10001, 0b11111, 0b10001, 0b10001],
      B: [0b11110, 0b10001, 0b11110, 0b10001, 0b11110],
      E: [0b11111, 0b10000, 0b11100, 0b10000, 0b11111],
      H: [0b10001, 0b10001, 0b11111, 0b10001, 0b10001],
      M: [0b10001, 0b11011, 0b10101, 0b10001, 0b10001],
      O: [0b01110, 0b10001, 0b10001, 0b10001, 0b01110],
      T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100],
      U: [0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
      Z: [0b11111, 0b00010, 0b00100, 0b01000, 0b11111],
      " ": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
    } as Record<string, number[]>,
  },

  // 5x7 — classic dot matrix
  classic: {
    width: 5,
    height: 7,
    gap: 1,
    glyphs: {
      A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
      B: [0b11110, 0b10001, 0b11110, 0b10001, 0b10001, 0b10001, 0b11110],
      E: [0b11111, 0b10000, 0b10000, 0b11100, 0b10000, 0b10000, 0b11111],
      H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
      M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
      O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
      T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
      U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
      Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
      " ": [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
    } as Record<string, number[]>,
  },
} as const;

export type FontStyle = keyof typeof FONTS;

export interface FontDef {
  width: number;
  height: number;
  gap: number;
  glyphs: Record<string, number[]>;
}

export function getFont(style: FontStyle): FontDef {
  return FONTS[style];
}
