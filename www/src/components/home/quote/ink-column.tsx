import { cn } from "@site/src/lib/utils";
import { type CSSProperties } from "react";
import styles from "./ink-column.module.css";

const STAGGER_MS = 90;
const INK_MS = 900;

/** Time until the last of `count` staggered characters has fully inked in. */
export const inkDuration = (count: number) =>
  Math.max(count - 1, 0) * STAGGER_MS + INK_MS;

// `startIndex` continues the stagger across columns, so a multi-column quote
// reads top to bottom, column by column.
export function InkColumn({
  text,
  startIndex = 0,
  className,
}: {
  text: string;
  startIndex?: number;
  className?: string;
}) {
  return (
    <span className={cn(styles.column, className)} aria-label={text}>
      {[...text].map((char, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={styles.ink}
          style={
            { "--delay": `${(startIndex + index) * STAGGER_MS}ms` } as CSSProperties
          }
        >
          {char}
        </span>
      ))}
    </span>
  );
}
