import {FC, useState} from "react";
import styles from "./canvas.module.css";

interface BarProps {
  x: number;
  restY: number;
  restH: number;
  hoverY: number;
  hoverH: number;
}

const bars: BarProps[] = [
  {x: 10, restY: 38, restH: 62, hoverY: 12, hoverH: 88},
  {x: 24, restY: 50, restH: 50, hoverY: 45, hoverH: 55},
  {x: 38, restY: 30, restH: 70, hoverY: 55, hoverH: 45},
  {x: 52, restY: 39, restH: 61, hoverY: 5, hoverH: 95},
  {x: 66, restY: 22, restH: 78, hoverY: 35, hoverH: 65},
  {x: 80, restY: 8, restH: 92, hoverY: 25, hoverH: 75},
  {x: 94, restY: 22, restH: 78, hoverY: 10, hoverH: 90},
];

const Canvas: FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <g
      className={styles.group}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Invisible hit area covering gaps between bars */}
      <rect width={100} height={100} fill="black" fillOpacity={0}/>
      {bars.map((bar) => (
        <rect
          key={bar.x}
          className={styles.bar}
          x={bar.x}
          y={hovered ? bar.hoverY : bar.restY}
          height={hovered ? bar.hoverH : bar.restH}
          width={7}
          rx={3.2}
        />
      ))}
    </g>
  );
}

export default Canvas;
