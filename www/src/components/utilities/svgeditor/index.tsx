import CustomTag from "@site/src/components/ui/custom-tag";
import {FC} from "react";
import Background from "./background";
import Reference from "./reference";
import Canvas from "./canvas";

const SvgEditor: FC = () => {
  return <div className={"flex flex-col gap-3"}>
    <CustomTag color="rose">SVG Editor</CustomTag>
    <svg width="100%" viewBox="-8 -3 114 109">
      <Background/>
      <Reference/>
      <Canvas/>
    </svg>
  </div>
}

export default SvgEditor;
