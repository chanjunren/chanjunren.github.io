import {FC} from "react";

const Canvas: FC = () => {
  return <>
    {/* TODO: paste and restructure SVG elements here */}
    <svg stroke={"var[(--foreground)]"}>
      <rect x={10} y={38} height={62} width={7} rx={3.2}/>
      <rect x={24} y={50} height={50} width={7} rx={3.2}/>
      <rect x={38} y={30} height={70} width={7} rx={3.2}/>
      <rect x={52} y={39} height={61} width={7} rx={3.2}/>
      <rect x={66} y={22} height={78} width={7} rx={3.2}/>
      <rect x={80} y={8} height={92} width={7} rx={3.2}/>
      <rect x={94} y={22} height={78} width={7} rx={3.2}/>
    </svg>
  </>
}

export default Canvas;
