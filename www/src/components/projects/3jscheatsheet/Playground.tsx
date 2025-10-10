import { FC } from "react";
import PrimaryHeader from "../../common/PrimaryHeader";
import Geometries from "./geometries";

const Playground: FC = () => {
  return (
    <>
      <div className="h-[80vh] flex flex-col items-center mt-8">
        <PrimaryHeader>🚧 WIP</PrimaryHeader>
        <Geometries />
      </div>
    </>
  );
};
export default Playground;
