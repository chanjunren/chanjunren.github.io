import { useEffect, useId, useRef } from "react";
import { toPoints, usePrevious } from "./utils";

export function Data({ data }) {
  const id = useId();
  const newPoints = toPoints(data, "data");
  const prevData = usePrevious(data);
  const prevPoints = toPoints(prevData, "data");
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.beginElement();
  }, [data]);

  return (
    <g>
      <defs>
        <marker id={id} markerWidth="4" markerHeight="4" refX="2" refY="2">
          <circle cx="2" cy="2" r="2" fill="currentColor" />
        </marker>
      </defs>
      <polygon
        points={newPoints}
        stroke="currentColor"
        strokeWidth="0.3"
        fill="var(--ifm-color-primary)"
        fillOpacity="0.18"
        markerStart={`url(#${id})`}
        markerMid={`url(#${id})`}
      >
        <animate
          ref={ref}
          attributeName="points"
          begin={"chart.click"}
          type="translate"
          from={prevPoints}
          to={newPoints}
          dur="0.1s"
        />
      </polygon>
    </g>
  );
}
