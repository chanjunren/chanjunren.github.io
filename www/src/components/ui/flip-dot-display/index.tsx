import { FC, useEffect, useState, useMemo } from "react";
import { cn } from "@site/src/lib/utils";
import { getFont, FontStyle, FontDef } from "./font";
import styles from "./index.module.css";

export type StaggerPattern = "diagonal" | "center" | "random" | "column";

interface FlipDotDisplayProps {
  texts: string[];
  font?: FontStyle;
  interval?: number;
  dotSize?: number;
  dotGap?: number;
  stagger?: StaggerPattern;
  transitionMs?: number;
  className?: string;
}

function textToGrid(text: string, font: FontDef): boolean[] {
  const upper = text.toUpperCase();
  const cols = upper.length * font.width + (upper.length - 1) * font.gap;
  const grid: boolean[] = new Array(font.height * cols).fill(false);

  let colOffset = 0;
  for (const char of upper) {
    const glyph = font.glyphs[char] ?? font.glyphs[" "];
    for (let row = 0; row < font.height; row++) {
      for (let col = 0; col < font.width; col++) {
        if (((glyph[row] >> (font.width - 1 - col)) & 1) === 1) {
          grid[row * cols + colOffset + col] = true;
        }
      }
    }
    colOffset += font.width + font.gap;
  }
  return grid;
}

function computeDelay(
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  pattern: StaggerPattern,
): number {
  switch (pattern) {
    case "diagonal":
      return (row + col) * 12;
    case "center": {
      const cr = totalRows / 2;
      const cc = totalCols / 2;
      return Math.sqrt((row - cr) ** 2 + (col - cc) ** 2) * 18;
    }
    case "random":
      return ((row * 7 + col * 13) % 17) * 18;
    case "column":
      return col * 15;
  }
}

const FlipDotDisplay: FC<FlipDotDisplayProps> = ({
  texts,
  font: fontStyle = "square",
  interval = 2000,
  dotSize = 2,
  dotGap = 1,
  stagger = "diagonal",
  transitionMs = 300,
  className,
}) => {
  const [index, setIndex] = useState(0);
  const font = useMemo(() => getFont(fontStyle), [fontStyle]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(id);
  }, [texts.length, interval]);

  const maxLen = useMemo(
    () => Math.max(...texts.map((t) => t.length)),
    [texts],
  );

  const currentText = texts[index].toUpperCase().padEnd(maxLen);
  const grid = textToGrid(currentText, font);
  const totalCols = maxLen * font.width + (maxLen - 1) * font.gap;

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${totalCols}, ${dotSize}px)`,
        gap: `${dotGap}px`,
      }}
    >
      {grid.map((active, i) => {
        const row = Math.floor(i / totalCols);
        const col = i % totalCols;
        return (
          <span
            key={i}
            className={cn(
              styles.dot,
              active ? styles.active : styles.inactive,
            )}
            style={{
              width: dotSize,
              height: dotSize,
              transitionDuration: `${transitionMs}ms`,
              transitionDelay: `${computeDelay(row, col, font.height, totalCols, stagger)}ms`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FlipDotDisplay;
export type { FlipDotDisplayProps };
