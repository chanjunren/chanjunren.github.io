import Image from "@docusaurus/plugin-ideal-image/lib/theme/IdealImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FC, useState } from "react";
const BestFooter: FC = () => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering ? (
        <Image
          className="h-24 w-24 bg-transparent"
          img={useBaseUrl("lbxx_booty_dance.gif")}
        />
      ) : (
        // <Image
        //   className="h-24 w-24 rounded-2xl bg-transparent"
        //   img={useBaseUrl("lbxx_booty_dance_static.gif")}
        // />
        <Image
          className="h-24 w-24 rounded-2xl bg-transparent"
          img={useBaseUrl("lbxx_static.png")}
        />
      )}
      <span className="font-mono mt-5">
        Built with{" "}
        <a href="https://docusaurus.io/" target="_blank">
          🦖
        </a>{" "}
        by Jun Ren
      </span>
    </div>
  );
};

export default BestFooter;
