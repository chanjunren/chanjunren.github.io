import classnames from "classnames";
import { FC, SVGProps, useState } from "react";
import PixelLabContainer from "../../helpers/container";
import styles from "./index.module.css";

const PaperPlaneIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg {...props} width={28} viewBox="0 0 64 48">
      <path
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
        d="M27,22.2
           l-4.8,10.012l8.391-7.115L22.2,32.212V20.4L61.375,1.125L22.2,20.4l-21-1.9c-0.9-0.3-1.4-1.3-1.1-2.3L60.8,0
           c0.9,0.3,1.4,1.3,1.1,2.3L43.8,32.8c-0.3,0.9-1.3,1.4-2.3,1.1L27,22.2L61.375,1.125L27,22.2z"
      />
    </svg>
  );
};

const PaperPlane: FC = () => {
  const [active, setActive] = useState<boolean>(false);
  return (
    <PixelLabContainer
      label="002"
      onClick={() => {
        if (!active) {
          setActive(true);
          setTimeout(() => {
            setActive(false);
          }, 5000);
        }
      }}
    >
      <PaperPlaneIcon
        aria-live={active ? "assertive" : "off"}
        className={classnames(styles.paperplane, active ? styles.active : "")}
      />
    </PixelLabContainer>
  );
};

export default PaperPlane;
