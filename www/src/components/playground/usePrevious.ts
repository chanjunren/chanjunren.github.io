import { useEffect, useRef } from "react";

// The key insight is that useEffect runs after the render, so returning ref.current before the effect runs gives you the value from the previous render cycle.
export function usePrevious(value: string) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
