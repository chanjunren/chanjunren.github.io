import { FC, SVGProps } from "react";
import PixelLabContainer from "../../helpers/PixelLabContainer";
import styles from "./index.module.css";

const DustbinIcon: FC<SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg {...props} viewBox="0 0 32 32">
      <g
        stroke-linejoin="round"
        stroke-linecap="round"
        stroke="currentColor"
        stroke-width="1.2"
        fill="none"
      >
        <g className="body">
          <polygon points="10 12, 11 24, 21 24, 22 12" />
          <line x1="18" y1="15" x2="18" y2="21" />
          <line x1="14" y1="15" x2="14" y2="21" />
        </g>
        <g className={styles.lid}>
          <line x1="9" y1="12" x2="23" y2="12" />
          <rect width="4" height="2.5" x="14" y="9.5" />
        </g>
      </g>
    </svg>
  );
};

export default function Dustbin() {
  return (
    <PixelLabContainer label="004" className={styles.dustbin}>
      <DustbinIcon width={40} />
    </PixelLabContainer>
  );
}
