import { useEffect, useRef } from "react";
import { usePrevious } from "./usePrevious";

export function ViewBox({ viewBox, children }) {
  const animateRef = useRef<SVGAnimateElement>(null);
  const prevValue = usePrevious(viewBox);

  useEffect(() => {
    animateRef.current?.beginElement();
  }, [viewBox]);

  return (
    <svg
      className="border-2 border-solid border-gray-300 rounded-lg p-5"
      viewBox={viewBox}
      width="400"
    >
      <animate
        attributeName="viewBox"
        ref={animateRef}
        from={prevValue}
        to={viewBox}
        dur={"0.2s"}
        begin={"indefinite"}
      />
      {children}
    </svg>
  );
}
