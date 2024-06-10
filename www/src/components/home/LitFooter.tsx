import Image from "@docusaurus/plugin-ideal-image/lib/theme/IdealImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FC, useState } from "react";
const LitFooter: FC = () => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <footer
      className="flex flex-col items-center col-span-7 align-self-end"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <section className="max-h-24 max-w-24 bg-transparent">
        {hovering ? (
          <Image img={useBaseUrl("lbxx_booty_dance.gif")} />
        ) : (
          <Image img={useBaseUrl("lbxx_static.png")} />
        )}
      </section>
      <span className="font-mono mt-5">
        Built with{" "}
        <a href="https://docusaurus.io/" target="_blank">
          🦖
        </a>{" "}
        by Jun Ren
      </span>
    </footer>
  );
};

export default LitFooter;
