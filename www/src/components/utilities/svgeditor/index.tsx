import CustomTag from "@site/src/components/ui/custom-tag";
import {FC} from "react";

const SvgEditor: FC = () => {
  return <div className={"flex flex-col gap-3"}>
    <CustomTag color="rose">SVG Editor</CustomTag>
    <svg width="100%" viewBox="-8 -3 114 109">
      <defs>
        <pattern id=":r1:" patternUnits="userSpaceOnUse" width="10" height="10">
          <path d="M 0 10 h 10 v -10" className="stroke-[var(--ifm-font-color-base)]" fill="none"
                vector-effect="non-scaling-stroke" stroke-dasharray="5"></path>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#:r1:)" opacity={"0.7"}/>
      <path className="stroke-[var(--ifm-font-color-base)]" d="M 0 100 v -100 h 100" fill="none"
            opacity={"0.4"}
            stroke-dasharray="5"
            vector-effect="non-scaling-stroke"></path>
      {Array.from({length: 11}, (_, i) => (
        <text
          key={`x-${i}`}
          x={i * 10}
          y={104}
          textAnchor="middle"
          fontSize="3"
          className="fill-[var(--ifm-font-color-base)]"
          opacity={0.5}
        >
          {i * 10}
        </text>
      ))}
      {Array.from({length: 11}, (_, i) => (
        <text
          key={`y-${i}`}
          x={-2}
          y={100 - i * 10 + 1}
          textAnchor="end"
          fontSize="3"
          className="fill-[var(--ifm-font-color-base)]"
          opacity={0.5}
        >
          {i * 10}
        </text>
      ))}
    </svg>
  </div>
}

export default SvgEditor;