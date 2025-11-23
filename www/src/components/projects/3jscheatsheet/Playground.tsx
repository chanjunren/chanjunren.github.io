import { FC } from "react";
import Geometries from "./geometries";

const Playground: FC = () => {
  return (
    <>
      <div className="h-[80vh] flex flex-col items-center mt-8">
        <Geometries />
      </div>
    </>
  );
};
export default Playground;
