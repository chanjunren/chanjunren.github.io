import { cn } from "@site/src/lib/utils";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import styles from "./split-flap.module.css";

const DEFAULT_CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/";
const STAGGER_MS = 50;

type Flip = { from: string; to: string };

// Characters outside the charset (e.g. a clock's colons) swap without flipping.
// Long runs skip ahead so only the last `maxFlips` characters are shown.
function nextChar(
  current: string,
  target: string,
  charset: string,
  maxFlips: number,
) {
  const index = charset.indexOf(current);
  const targetIndex = charset.indexOf(target);
  if (index === -1 || targetIndex === -1) return target;
  const size = charset.length;
  const distance = (targetIndex - index + size) % size;
  const step = distance > maxFlips ? distance - maxFlips + 1 : 1;
  return charset[(index + step) % size];
}

function Half({
  char,
  position,
  className,
  onAnimationEnd,
}: {
  char: string;
  position: "top" | "bottom";
  className?: string;
  onAnimationEnd?: () => void;
}) {
  return (
    <span
      className={cn(styles.half, styles[position], className)}
      onAnimationEnd={onAnimationEnd}
    >
      <span>{char}</span>
    </span>
  );
}

function Cell({
  char,
  charset,
  maxFlips,
  initial,
  paused,
}: {
  char: string;
  charset: string;
  maxFlips: number;
  initial: string;
  paused: boolean;
}) {
  const [shown, setShown] = useState(initial);
  const [flip, setFlip] = useState<Flip | null>(null);

  useEffect(() => {
    if (paused || flip || shown === char) return;
    setFlip({ from: shown, to: nextChar(shown, char, charset, maxFlips) });
  }, [char, charset, flip, maxFlips, paused, shown]);

  // The fold halves unmount between steps, so each step replays its animation.
  return (
    <span className={styles.cell}>
      <Half char={flip ? flip.to : shown} position="top" />
      <Half char={flip ? flip.from : shown} position="bottom" />
      {flip && (
        <>
          <Half char={flip.from} position="top" className={styles.foldTop} />
          <Half
            char={flip.to}
            position="bottom"
            className={styles.foldBottom}
            onAnimationEnd={() => {
              setShown(flip.to);
              setFlip(null);
            }}
          />
        </>
      )}
    </span>
  );
}

// A slot that mounts after the first render enters blank, then flips once settled.
function Slot({
  char,
  charset,
  maxFlips,
  entering,
  enterDelay,
  exitDelay,
  exiting,
  onExited,
}: {
  char: string;
  charset: string;
  maxFlips: number;
  entering: boolean;
  enterDelay: number;
  exitDelay: number;
  exiting: boolean;
  onExited: () => void;
}) {
  const [settling, setSettling] = useState(entering);
  const [delay] = useState(enterDelay);
  // Freeze the exit delay: it shifts as earlier slots are removed, and a
  // changed delay would jump a running animation forward.
  const [frozenExitDelay, setFrozenExitDelay] = useState<number | null>(null);
  if (exiting && frozenExitDelay === null) setFrozenExitDelay(exitDelay);
  if (!exiting && frozenExitDelay !== null) setFrozenExitDelay(null);

  return (
    <span
      aria-hidden="true"
      className={cn(
        styles.slot,
        settling && styles.enter,
        exiting && styles.exit,
      )}
      style={
        {
          "--delay": `${exiting ? (frozenExitDelay ?? exitDelay) : delay}ms`,
        } as CSSProperties
      }
      onAnimationEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (exiting) onExited();
        else setSettling(false);
      }}
    >
      <Cell
        char={char}
        charset={charset}
        maxFlips={maxFlips}
        initial={entering ? " " : char}
        paused={settling}
      />
    </span>
  );
}

function SplitFlap({
  value,
  charset = DEFAULT_CHARSET,
  maxFlips = 5,
  flipMs = 160,
  flipIn = false,
  className,
}: {
  value: string;
  charset?: string;
  maxFlips?: number;
  flipMs?: number;
  /** Mounts blank, then pops the cards in and flips them to `value`. */
  flipIn?: boolean;
  className?: string;
}) {
  const [started, setStarted] = useState(!flipIn);
  useEffect(() => setStarted(true), []);
  const target = started ? value.toUpperCase() : "";
  const [count, setCount] = useState(target.length);
  const mounted = useRef(false);
  const previousLength = useRef(target.length);
  const lastChars = useRef<string[]>([]);

  const length = Math.max(count, target.length);
  const chars = Array.from(
    { length },
    (_, index) => target[index] ?? lastChars.current[index] ?? " ",
  );

  useEffect(() => {
    if (target.length > count) setCount(target.length);
  }, [count, target.length]);

  useEffect(() => {
    mounted.current = true;
    previousLength.current = target.length;
    lastChars.current = chars;
  });

  return (
    <span
      data-slot="split-flap"
      className={cn(
        "inline-flex font-mono text-(--menu-foreground)",
        className,
      )}
      style={{ "--flip-half": `${flipMs / 2}ms` } as CSSProperties}
    >
      <span className="sr-only">{value}</span>
      {chars.map((char, index) => (
        <Slot
          key={index}
          char={char}
          charset={charset}
          maxFlips={maxFlips}
          entering={mounted.current}
          enterDelay={(index - previousLength.current) * STAGGER_MS}
          exiting={index >= target.length}
          exitDelay={(length - 1 - index) * STAGGER_MS}
          onExited={() =>
            // Exits run right to left, so the last slot always leaves first.
            setCount((current) => (index === current - 1 ? current - 1 : current))
          }
        />
      ))}
    </span>
  );
}

export { SplitFlap };
