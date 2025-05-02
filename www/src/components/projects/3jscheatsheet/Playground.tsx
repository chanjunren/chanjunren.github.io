import { FC } from "react";
import PrimaryHeader from "../../common/PrimaryHeader";
import Geometries from "./geometries";

const Playground: FC = () => {
  return (
    <>
      <div className="h-[80vh]">
        <PrimaryHeader className="!justify-self-end">🚧 WIP</PrimaryHeader>
        <Geometries />
      </div>
    </>
  );
};
export default Playground;
