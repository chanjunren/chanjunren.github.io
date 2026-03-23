import {forwardRef, useState} from "react";
import styles from "./index.module.css";

interface BarDef {
  x: number;
  restY: number;
  restH: number;
  hoverY: number;
  hoverH: number;
}

const bars: BarDef[] = [
  {x: 1, restY: 5, restH: 9, hoverY: 2, hoverH: 12},
  {x: 3, restY: 7, restH: 7, hoverY: 5, hoverH: 9},
  {x: 5, restY: 4, restH: 10, hoverY: 8, hoverH: 6},
  {x: 7, restY: 5, restH: 9, hoverY: 1, hoverH: 13},
  {x: 9, restY: 3, restH: 11, hoverY: 6, hoverH: 8},
  {x: 11, restY: 1, restH: 13, hoverY: 4, hoverH: 10},
  {x: 13, restY: 3, restH: 11, hoverY: 2, hoverH: 12},
];

const AnimatedBarChartIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => {
    const [hovered, setHovered] = useState(false);

    return (
      <svg
        ref={ref}
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g
          className={styles.group}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <rect width={15} height={15} fill="black" fillOpacity={0}/>
          {bars.map((bar) => (
            <rect
              key={bar.x}
              className={styles.bar}
              x={bar.x}
              y={hovered ? bar.hoverY : bar.restY}
              height={hovered ? bar.hoverH : bar.restH}
              width={1}
              rx={0.5}
              fill="currentColor"
            />
          ))}
        </g>
      </svg>
    );
  },
);

export default AnimatedBarChartIcon;
