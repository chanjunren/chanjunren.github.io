import { useEffect, useRef } from "react";

export function usePrevious(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const MIN = 1;
const MAX = 30;

const nameToRange = {
  neutral: {
    p0: [50, 20],
    p1: [50, 44],
  },
  sell: {
    p0: [22, 40],
    p1: [45, 48],
  },
  strongSell: {
    p0: [32, 74],
    p1: [47, 54],
  },
  strongBuy: {
    p0: [68, 74],
    p1: [53, 54],
  },
  buy: {
    p0: [78, 40],
    p1: [55, 48],
  },
};
const order = ["neutral", "buy", "strongBuy", "strongSell", "sell"];

const transform = (value, [a, b], [c, d]) =>
  ((value - a) * (d - c)) / (b - a) + c;

const getCoordinate = (p0, p1) => (value) => {
  const [x1, y1] = p0;
  const [x0, y0] = p1;
  return [
    transform(value, [MIN, MAX], [x0, x1]),
    transform(value, [MIN, MAX], [y0, y1]),
  ];
};

export const toPoints = (input, name) => {
  const points = order.map((name) => {
    const range = nameToRange[name];
    const getCoordinateForName = getCoordinate(range.p0, range.p1);
    return getCoordinateForName(input[name]);
  });
  return points.map(([x, y]) => `${x},${y}`).join(" ");
};
