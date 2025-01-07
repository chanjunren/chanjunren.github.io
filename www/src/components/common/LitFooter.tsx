import Image from "@docusaurus/plugin-ideal-image/lib/theme/IdealImage";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FC, useState } from "react";
import { DocusaurusIcon } from "./Icons";

const LitFooter: FC = () => {
  const [hovering, setHovering] = useState<boolean>(false);

  return (
    <footer className="flex flex-col items-center align-self-end gap-2">
      <section
        className="max-h-24 max-w-24 bg-transparent"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {hovering ? (
          <Image img={useBaseUrl("lbxx_booty_dance.gif")} />
        ) : (
          <Image img={useBaseUrl("lbxx_static.png")} />
        )}
      </section>
      <span className="flex justify-center gap-2 mt-3">
        Built with{" "}
        <a href="https://docusaurus.io/" target="_blank">
          <DocusaurusIcon className="h-6 w-6" />
        </a>{" "}
        by CJR
      </span>
    </footer>
  );
};

export default LitFooter;
