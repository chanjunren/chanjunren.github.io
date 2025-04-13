import { FC } from "react";
import FloatingMenu from "./floatingmenu";
import Geometries from "./geometries";

const Playground: FC = () => {
  return (
    <>
      <FloatingMenu />
      <div className="h-[80vh]">
        <Geometries />
      </div>
    </>
  );
};
export default Playground;
