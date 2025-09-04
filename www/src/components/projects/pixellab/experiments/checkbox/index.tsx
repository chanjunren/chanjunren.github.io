import { usePrevious } from "@site/src/components/hooks/usePrevious";
import { FC, useEffect, useRef, useState } from "react";
import PixelLabContainer from "../../helpers/PixelLabContainer";

const CheckboxIcon: FC = () => {
  const [offset, setOffset] = useState<number>(15);
  const prevOffset = usePrevious(offset);
  const animRef = useRef<SVGAnimateElement | null>(null);

  useEffect(() => {
    animRef.current?.beginElement();
  }, [offset]);

  return (
    <div className="cursor-pointer">
      <svg
        viewBox="0 0 24 24"
        width="45"
        stroke="currentColor"
        id="checkbox-container"
        onClick={() => setOffset(offset === 0 ? 15 : 0)}
      >
        <rect
          width="8"
          height="8"
          y="8"
          x="6"
          fill="none"
          rx="1"
          strokeWidth={0.8}
        />
        <path
          className="checkmark"
          d="M7.75 11.75 L10 14.25 L16.25 7.75"
          strokeWidth="1.5"
          strokeDasharray={15}
          strokeDashoffset={offset}
          fill="none"
        >
          <animate
            //  Can't rely on `begin="click"` because React state updates are async.
            // If you need to animate to the latest offset, call `animRef.current.beginElement()` in useEffect.
            attributeName="stroke-dashoffset"
            ref={animRef}
            from={prevOffset}
            to={offset}
            dur="0.3s"
            fill="freeze"
          />
        </path>
      </svg>
    </div>
  );
};

export default function Checkbox() {
  return (
    <PixelLabContainer label="009">
      <CheckboxIcon />
    </PixelLabContainer>
  );
}
